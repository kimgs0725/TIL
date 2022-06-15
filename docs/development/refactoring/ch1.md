---
sidebar_position: 1
title: 냄새 1. 이해하기 힘든 이름
---

## 개요

- 깔끔한 코드에서 가장 중요한 것 중 하나가 바로 **좋은 이름**
- 함수, 변수, 클래스, 모듈의 이름 등 모두 어떤 역할을 하는지 어떻게 쓰이는지 **직관적**이어야 함

## 리팩토링 1. 함수 선언 변경하기

- 좋은 이름을 가진 함수는 함수가 어떻게 구현되었는지 코드를 보지 않아도 이름만 보고도 이해 가능
- 좋은 이름을 찾아내는 방법?
    - 함수에 주석을 작성(어떤 역할을 하는지 설명)
    - 주석을 함수 이름으로 만들어봄
- 함수의 매개변수는
    - 함수 내부 문맥을 결정
    - 의존성을 결정

### before

```java
public class StudyDashboard {

    private Set<String> usernames = new HashSet<>();

    private Set<String> reviews = new HashSet<>();

    /**
     * studyReviews은 study를 리뷰한다는 건지, 리뷰를 로드해오는 건지 알기 힘듦
     */
    private void studyReviews(GHIssue issue) throws IOException {
        List<GHIssueComment> comments = issue.getComments();
        for (GHIssueComment comment : comments) {
            usernames.add(comment.getUserName());
            reviews.add(comment.getBody());
        }
    }

    public Set<String> getUsernames() {
        return usernames;
    }

    public Set<String> getReviews() {
        return reviews;
    }

    public static void main(String[] args) throws IOException {
        GitHub gitHub = GitHub.connect();
        GHRepository repository = gitHub.getRepository("whiteship/live-study");
        GHIssue issue = repository.getIssue(30);

        StudyDashboard studyDashboard = new StudyDashboard();
        studyDashboard.studyReviews(issue);
        studyDashboard.getUsernames().forEach(System.out::println);
        studyDashboard.getReviews().forEach(System.out::println);
    }
}
```

### after
```java
public class StudyDashboard {

    private Set<String> usernames = new HashSet<>();

    private Set<String> reviews = new HashSet<>();

    /**
     * studyReviews 대신 loadReviews로 바꿈 -> 리뷰를 로드해온다는 의미로 받아들임
     * 요구사항이 30번쨰 Issue에 달린 코멘트를 로드해오는 것 -> GitHub 초기화도 같이 추가
     */
    private void loadReviews() throws IOException {
        GitHub gitHub = GitHub.connect();
        GHRepository repository = gitHub.getRepository("whiteship/live-study");
        GHIssue issue = repository.getIssue(30);

        List<GHIssueComment> comments = issue.getComments();
        for (GHIssueComment comment : comments) {
            usernames.add(comment.getUserName());
            reviews.add(comment.getBody());
        }
    }

    public Set<String> getUsernames() {
        return usernames;
    }

    public Set<String> getReviews() {
        return reviews;
    }

    public static void main(String[] args) throws IOException {
        StudyDashboard studyDashboard = new StudyDashboard();
        studyDashboard.loadReviews();
        studyDashboard.getUsernames().forEach(System.out::println);
        studyDashboard.getReviews().forEach(System.out::println);
    }
}
```

## 리팩토링 2. 변수 이름 바꾸기

- 더 많이 사용되는 변수일수록 이름이 중요
    - 변수가 커버하는 스코프가 작을수록 중요성 떨어짐(ex. 람다식 변수)
- 다이나믹 타입을 지원하는 언어에선 타입을 이름에 넣기도 함
- 여러 함수에 걸쳐 쓰이는 필드 이름에는 더 많이 고민

### BEFORE
```java
private void loadReviews() throws IOException {
    GitHub gitHub = GitHub.connect();
    GHRepository repository = gitHub.getRepository("whiteship/live-study");
    GHIssue issue = repository.getIssue(30);

    /*
     * review를 로드하는데, 코멘트를 로드하는 것처럼 보임
     */
    List<GHIssueComment> comments = issue.getComments();
    for (GHIssueComment comment : comments) {
        usernames.add(comment.getUserName());
        reviews.add(comment.getBody());
    }
}
```

### AFTER

```java
private void loadReviews() throws IOException {
    GitHub gitHub = GitHub.connect();
    GHRepository repository = gitHub.getRepository("whiteship/live-study");
    GHIssue issue = repository.getIssue(30);

    /*
     * comments -> reviews로 변경. 변수에 기능에 맞는 이름을 부여
     */
    List<GHIssueComment> reviews = issue.getComments();
    for (GHIssueComment review : reviews) {
        usernames.add(review.getUserName());
        this.reviews.add(review.getBody());
    }
}
```

## 리팩토링 3. 필드 이름 바꾸기

- 리팩토링 2에서 이어서, 필드는 클래스 전역에서 사용되기 때문에 명명을 잘 해야함
    - 다른 변수와의 차별을 위해, 필드는 뒤에 `this`를 붙여 사용
- `Record` 자료 구조의 필드 이름은 프로그램 전반에 걸쳐 참조될 수 있기 때문에 매우 중요
    - [Record](https://www.baeldung.com/java-15-new): 특정 데이터와 관련있는 필드를 묶어놓은 자료 구조
    - 파이썬의 `Dictionary`, C#의 `Record`, Kotlin의 `data class`
    - 자바 14부터 지원

### BEFORE

```java
public class StudyDashboard {

    /*
     * usernames와 reivews를 Record로 사용할 수 있음
     */
    private Set<String> usernames = new HashSet<>();

    private Set<String> reviews = new HashSet<>();

    private void loadReviews() throws IOException {
        GitHub gitHub = GitHub.connect();
        GHRepository repository = gitHub.getRepository("whiteship/live-study");
        GHIssue issue = repository.getIssue(30);

        List<GHIssueComment> reviews = issue.getComments();
        for (GHIssueComment review : reviews) {
            usernames.add(review.getUserName());
            this.reviews.add(review.getBody());
        }
    }

    public Set<String> getUsernames() {
        return usernames;
    }

    public Set<String> getReviews() {
        return reviews;
    }

    public static void main(String[] args) throws IOException {
        StudyDashboard studyDashboard = new StudyDashboard();
        studyDashboard.loadReviews();
        studyDashboard.getUsernames().forEach(System.out::println);
        studyDashboard.getReviews().forEach(System.out::println);
    }
}

```

### AFTER

```java
public record StudyReview(String reviewer, String review) {
    // kotlin의 data class와 매우 흡사
}

public class StudyDashboard {

    /*
     * (usernames, reivews) -> studyReviews로 통일
     * study
     */
    private Set<StudyReview> studyReviews = new HashSet<>();

    private void loadReviews() throws IOException {
        GitHub gitHub = GitHub.connect();
        GHRepository repository = gitHub.getRepository("whiteship/live-study");
        GHIssue issue = repository.getIssue(30);

        List<GHIssueComment> reviews = issue.getComments();
        for (GHIssueComment review : reviews) {
            studyReviews.add(new StudyReview(review.getUserName(), review.getBody()));
        }
    }

    public Set<StudyReview> getSutdyReviews() {
        return this.studyReviews;
    }

    public static void main(String[] args) throws IOException {
        StudyDashboard studyDashboard = new StudyDashboard();
        studyDashboard.loadReviews();
        studyDashboard.getSutdyReviews().forEach(System.out::println);
    }
}

```