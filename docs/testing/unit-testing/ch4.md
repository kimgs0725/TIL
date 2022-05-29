---
sidebar_position: 4
title: 4. 좋은 단위 테스트의 4대 요소
---

- **가치 있는 테스트를 식별**하는 것과 **가치 있는 테스트를 작성**하는 것은 별개의 기술
- 이 장에서 테스트를 식별하는 방법을 알아봄

## 1. 좋은 단위 테스트의 4대 요소 자세히 살펴보기

- 좋은 단위 테스트는 다음 4개가 있음
    - 회귀 방지
    - 리팩터링 내성
    - 빠른 피드백
    - 유지 보수성
### 1. 첫 번째 요소: 회귀 방지

- 회귀: 소프트웨어 버그. 코드 수정 후 기능이 의도한대로 동작하지 않는 경우
    - 코드베이스가 커질수록 잠재적인 버그에 많이 노출됨
- 회귀 방지 지표 평가사항
    - 테스트 중에 실행되는 코드의 양
    - 코드 복잡도
    - 코드의 도메인 유의성
- 비즈니스에 중요한 기능은 버그에 가장 큰 피해를 입음
- 서드파티를 검증하는 것도 중요

### 2. 두 번쨰 요소: 리팩토리 내성

- 테스트를 **실패하지 않고** 코드를 리팩토링할 수 있는지에 대한 척도
- 새로운 기능을 개발하였고, 모든 테스트가 통과되었다고 가정
    - 코드를 정리, 리팩토링 이후에 테스트가 실패하고 있음
    - 기능적으로 아무 이상없이 동작하지만, 테스트에서 실패하고 있음
    - 이를 **거짓 양성(False Positive)**라고 함
- 거짓 양성은 허위 경보. 실제로 기능은 의도한대로 동작하지만 테스트는 실패를 나타냄
- 거짓 양성을 줄일수록 리팩토링 내성이 뛰어남을 의미
- 리팩토링 내성이 뛰어날수록 다음과 같은 장점이 있음
    - 기존 기능이 고장 났을 때 테스트가 조기 경보
    - 코드 변경이 회귀로 이어지지 않을 것이라고 확인을 줌
- 거짓 양성은 두 가지 이점을 방해함
    - 테스트가 타당한 이유없이 실패하면, 코드 문제에 대응하는 능력과 의지가 희석됨
    - 테스트 스위트의 신뢰도 하락 -> 테스트가 안전망으로 인식되지 않음

### 3. 무엇이 거짓 양성의 원인일까?
- 테스트와 테스트 대상 시스템(SUT)의 **구현 세부 사항과 많이 결합될수록** 거짓 양성이 많이 생김
    - 구현 세부사항과 테스트를 분리해야함
- `MessageRenderer`는 머리글, 본문, 바닥글을 포함하는 메시지의 HTML 표현을 생성
```java
public class Message {
    private String header;
    private String body;
    private String footer;
}

public interface Renderer {
    String render(Message message);
}

public class MessageRenderer implements Renderer {

    public List<Renderer> subRendererList;

    public MessageRenderer() {
        subRendererList = Arrays.asList(
                new HeaderRenderer(),
                new BodyRenderer(),
                new FooterRenderer()
        );
    }

    @Override
    public String render(Message message) {
        return subRendererList
                .stream()
                .map(renderer -> renderer.render(message))
                .reduce("", (html, str) -> html += str);
    }
}
```
- `MessageRenderer`를 다음과 같이 테스트함. 이 클래스가 따르는 알고리즘을 분석하는 것
```java
public class RendererTest {

    @Test
    void MessageRenderer_uses_correct_sub_renderers() {
        // given
        MessageRenderer sut = new MessageRenderer();
        // when
        List<Renderer> renderers = sut.subRendererList;
        // then
        assertThat(renderers.get(0)).isInstanceOf(HeaderRenderer.class);
        assertThat(renderers.get(1)).isInstanceOf(BodyRenderer.class);
        assertThat(renderers.get(2)).isInstanceOf(FooterRenderer.class);
    }
}
```
- 하위 렌더링 킄래스가 예상하는 모든 유형이고 올바른 순서로 나타나는지 여부를 확인
- 만약 하위 렌더링 클래스를 재배열하거나, 그 중 하나를 새것으로 교체해도 기능상에 이상은 없음
    - 결과적으로 반환되는 HTML 문서는 동일하게 유지 가능
- 하지만 테스트는 실패하게 됨
    - 똑같이 적용할 수 있는 다른 구현은 고려 X
    - 특정 구현만 예상하여 알고리즘을 검사

![image](https://user-images.githubusercontent.com/4207192/170476997-a733b063-03d8-4533-9bd3-a8b9a10ae9d4.png)


### 4. 구현 세부 사항 대신 최종 결과를 목표로 하기

- 리팩토링 내성을 높이기 위해선 SUT의 구현 세부사항과 테스트 간의 결합도를 낮추는 것
- 우리가 테스트해야할 목표를 알고리즘이 아닌 최종 결과에 포커싱!!

```java
public class RendererTest {

  @Test
  void Rendering_a_message() {
      // given
      MessageRenderer sut = new MessageRenderer();
      Message message = new Message("h", "b", "f");
      // when
      String html = sut.render(message);
      // then
      assertThat(html).isEqualTo("<h1>h</h1><p>b</p><h4>f</h4>");
  }

}
```

![image](https://user-images.githubusercontent.com/4207192/170477504-743ebfe7-6054-4735-ab79-8cd53545cec4.png)

- 테스트는 항상 적시에 실패하고 고객에게 영향을 줄 수 있는 애플리케이션 동작의 변경을 알려주므로 개발자가 주의를 기울여야 함
- 하지만 완전히 거짓 양성을 없앨 수 없음
    - 예를 들어서, `render`의 매개변수가 추가됨. `render` 함수를 참조한 것도 SUT와 결합된 세부 사항
    - 그래서 `render` 함수에 매개변수가 변화됨. 그렇게 테스트가 실패될 수 있음
    - 하지만 이런 종류의 거짓 양성은 컴파일러 단에서 알려주기 때문에 쉽게 해결. 문제는 컴파일 오류나지 않는 에러

## 2. 첫 번째 특성과 두 번째 특성 간의 본질적인 관계

- 두 특성은 테스트 스위트의 정확도에 기여
- 프로젝트가 진행됨에 따라 프로젝트에 다르게 영향을 미침
    - 프로젝트가 시작된 직후에는 회귀 방지를 훌륭히 갖추는 것이 중요
    - 기팩터링 내성은 바로 피룡하지 않음

### 1. 테스트 정확도 극대화

- 코드 정확도와 테스트 결과의 관계는 다음과 같이 볼 수 있음

![image](https://user-images.githubusercontent.com/4207192/170814784-6948b140-560b-4f10-84e8-640c33d95b2f.png)

- 올바른 추론: 테스트가 통과하고 기본 기능이 의도한대로 잘 작동하는 상황/테스트가 실패하고 기본 기능도 의도한대로 동작하지 않는 상황
- 테스트는 통과 되었으나 기본 기능이 의도한대로 동작하지 않는 것이 문제 -> 거짓 음성
    - 회귀 방지에 훌륭한 테스트라면 거짓 음성의 수를 최소화 할 수 있음
- 기능은 올바르게 동작, but 테스트가 실패 -> 거짓 양성
    - 리팩토링에 내성이 있는 테스트가 거짓 양성을 피하는데 도움을 줌
- 테스트 정확도 지표는 다음 두 가지 요소로 구성
    - 테스트가 버그 있음을 얼마나 잘 나타내는가?(거짓 음성(회귀 방지 영역) 제외)
    - 테스트가 버그 없을을 얼마나 잘 나타내는가?(거짓 양성(리팩토링 내성 영역) 제외)

    ![image](https://user-images.githubusercontent.com/4207192/170815270-70a4be06-ff28-454d-9d97-e87effb5f353.png)

### 2. 거짓 양성과 거짓 음성의 중요성: 역학 관계

- 프로젝트가 성장함에 따라 거짓 양성은 테스트 스위트에 점점 더 큰 영향을 미치기 시작함

![image](https://user-images.githubusercontent.com/4207192/170857287-34c0cc5f-a9f7-4034-b724-fd319f7926f2.png)

- 초반에는 리팩토링의 중요성이 크지 않기 때문에 거짓 양성이 중요하지 않음
- 하지만 프로젝트가 진행됨에 따라 코드베이스도 나빠짐
    - 이런 경향을 줄일려면 리팩토링은 필수
    - 이 떄, 거짓 양성의 중요성이 커지고, 리팩토링의 내성이 중요

## 3. 세 번쨰 요소와 네 번쨰 요소: 빠른 피드백과 유지 보수성

- 빠른 피드백은 단위 테스트의 필수 속성
    - 테스트가 빠르게 실행되면 코드에 결함이 생기자마자 버그에 대해 경고하기 시작할 정도로 피드백 루프를 줄임
    - 버그 수정 비용을 0까지 줄일 수 있음
- 유지 보수성 평가를 위한 지표는 다음과 같음
    - 테스트가 얼마나 이해하기 어려운가?
    - 테스트가 얼마나 실행하기 어려운가?

## 4. 이상적인 테스트를 찾아서

- 앞에서 살펴본 테스트 4가지 특성을 곱하면 테스트의 가치가 결정
- 물론 이런 특성을 정확하게 측정하기란 불가능

### 1. 이상적인 테스트를 만들 수 있는가?

- 이상적인 테스트는 네 가지 특성 모두 최대 점수를 받는 테스트
- 처음 세가지 특성인 `회귀 방지`, `리팩터링 내성`, `빠른 피드백`은 **상호 배타적**
- 세가지 특성 모두 최대로 하는 건 불가능
- 따라서 특성 중 어느 것도 크게 줄지 않는 방식을 택해야함
- 위 세가지 특성에 따른 테스트들을 소개

### 2. 극단적인 사례 1: 엔드 투 엔드 테스트

- 엔트 투 엔드: 최종 사용자 관점에서 시스템을 살펴봄
    - UI, 데이터베이스, 외부 애플리케이션을 포함한 테스트
- 엔드 투 엔드 테스트는 많은 코드를 테스트 -> 회귀 방지를 훌륭히 해냄
- 또한 리팩토링 내성도 우수
    - 식별할 수 있는 동작을 변경하지 않으므로 엔드 투 엔드 테스트에 영향을 미치지 않음
- 하지만 테스트 속도가 느림

### 3. 극단적이 사례 2: 간단한 테스트

- 이번엔 회귀 방지 특성을 희생하여 나머지 두 속성을 극대화하는 테스트인 **간단한 테스트(trival test)**가 있음

```java
public class User {
    private String name;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

@Test
void test() {
    var sut = new User();
    sut.setName("John Smith");
    assertThat(sut.getName()).isEqualTo("John Smith");
}
```

- 엔드 투 엔드와 달리 간단한 테스트는 매우 빠르게 실행 -> 빠른 피드백을 제공
- 거짓 양성이 생길 가능성이 상당히 낮음 -> 리팩토링 내성 우수
- 기반 코드에 실수할 여지가 많음 -> 회귀를 나타내지 않음
- 간단한 테스트는 이름만 바꿀 뿐 '동어 반복 테스트'를 불러옴 -> 항상 통과하기 때문에 검증이 무의미

### 4. 극단적이 사례 3: 깨지기 쉬운 테스트

- 실행이 빠르면서 회귀를 잡을 가능성은 높지만 거짓 양성이 많은 테스트를 작성하기 쉬움 -> 깨지기 쉬운 테스트

```java
public class UserRepository {
    public User getById(int id) {
        /* ... */
    }

    public String lastExecutedSqlStatement;
}

@Test
void getById_executes_correct_SQL_code() {
    var sut = new UserRepository();

    User user = sut.getById(5);

    assertThat(sut.lastExecutedSqlStatement).isEqualTo("SELECT * FROM dbo.[USER] WHERE UserID = 5")
}
```

- 데이터베이스에서 사용자를 가져올 때 올바른 SQL문을 생성하는지 확인하는 테스트
    - 이 테스트로 버그는 잡을 수 있으나, 리팩토링 내성에 좋지 않음
    - SQL문은 다양한 형태로 조회할 수 있음
    - 이는 구현 세부 사항과 강하게 결합된 예임

### 5. 이상적인 테스트를 찾아서: 결론

## 5. 대중적인 테스트 자동화 개념 살펴보기

### 1. 테스트 피라미드 분해
### 2. 블랙박스 테스트와 화이트박스 테스트 간의 선택

## 요약