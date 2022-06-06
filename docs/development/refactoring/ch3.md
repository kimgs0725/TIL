---
sidebar_position: 3
title: 냄새 3. 긴 함수
---

## 개요

- 짧은 함수 vs 긴 함수
    - 함수가 길수록 이해하기 어려움 vs 함수가 짧을수록 많은 문맥 전환이 필요
    - **과거에는** 작은 함수를 사용하는 경우 더 많은 서브루틴(함수) 호출로 인한 오버헤드 있었음
    - 지금은 컴파일러단에서 최적화를 통해 많은 서브루틴 호출을 줄일 수 있음
    - 작은 함수에 **좋은 이름**를 사용했다면 해당 함수의 코드를 보지 않고도 이해할 수 있어야 함
    - 어떤 코드에 **주석**을 남기고 싶다면, 주석 대신 함수를 만들고 함수의 이름으로 **의도**를 표현
- 99%는 **함수 추출하기**로 해결할 수 있음
- 함수를 분리하면서 **전달해야할 매개변수가 많아진다면** 다음 리팩토링을 고려
    - 임시 변수를 질의 함수로 바꾸기
    - 매개변수 객체 만들기
    - 객체 통째로 넘기기
- **조건문 분해하기**를 사용해 조건문을 분리할 수 있음
- 같은 조건으로 여러개 switch 문이 있다면, **조건문을 다형성으로 바꾸기**를 사용할 수 있음
- 반복문 안에 여러 작업을 하고 있어서 하나의 메소드로 추출하기 어렵다면, **반복문 쪼개기**를 적용할 수 있음

## 임시 변수를 질의 함수로 바꾸기

- 변수를 사용하면 반복해서 동일한 식을 계산하는 것을 피할 수 있음. 또 이름을 사용해 의미를 표현할 수 있음
- 긴 함수를 리팩토링할 때, 그러한 임시 변수를 함수로 추출하여 분리 -> 뺴낸 함수로 전달해야할 매개변수를 줄일 수 있음

### before
```java
private void print() {

    ...

    participants.forEach(p -> {
        long count = p.homework().values().stream()
                .filter(v -> v == true)
                .count();
        double rate = count * 100 / totalNumberOfEvents;

        String markdownForHomework = String.format("| %s %s | %.2f%% |\n", p.username(), checkMark(p, totalNumberOfEvents), rate);
        writer.print(markdownForHomework);
    });

}
```
- **함수 추출하기**를 통해 markdown을 프린트하는 부분을 추츨

```java
private void print() {

    ...

    participants.forEach(p -> {
        long count = p.homework().values().stream()
                .filter(v -> v == true)
                .count();
        double rate = count * 100 / totalNumberOfEvents;

        String markdownForHomework = getMarkdownForParticipant(totalNumberOfEvents, p, rate);
        writer.print(markdownForHomework);
    });
}

private String getMarkdownForParticipant(int totalNumberOfEvents, Participant p, double rate) {
    String markdownForHomework = String.format("| %s %s | %.2f%% |\n", p.username(), checkMark(p, totalNumberOfEvents), rate);
    return markdownForHomework;
}

```
- 여기서 `getMarkdownForParticipant` 함수의 매개변수인 `rate`는 질의 함수로 바꿀 수 있음
- 그러면 `getMarkdownForParticipant` 함수 매개변수를 3 -> 2개로 줄일 수 있음

### after
```java
private void print() {

    ...

    participants.forEach(p -> {
        String markdownForHomework = getMarkdownForParticipant(totalNumberOfEvents, p);
        writer.print(markdownForHomework);
    });
}

private String getMarkdownForParticipant(int totalNumberOfEvents, Participant p) {
    return String.format("| %s %s | %.2f%% |\n", p.username(), checkMark(p, totalNumberOfEvents), getRate(totalNumberOfEvents, p));
}

private double getRate(int totalNumberOfEvents, Participant p) {
    long count = p.homework().values().stream()
            .filter(v -> v == true)
            .count();
    return (double) (count * 100 / totalNumberOfEvents);
}
```