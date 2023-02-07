---
sidebar_position: 5
title: 5. 목과 테스트 취약성
---

- 테스트에서 목(Mock)을 사용하는 건 대해 논란의 여지가 있는 주재
    - 훌륭한 도구 vs 테스트 취약성을 초래
- 진리의 케바케였나? 목을 적용하는 것이 바람직한 케이스도 있고, 아닌 경우도 있음
- 이번장에선 리팩토리 내성이 부족한 테스트를 초래하는 케이스에 대해 살핌

## 1. 목과 스텁 구분

- 테스트 대역의 또 다른 유형이 있는데 그것이 스텁(Stub)
    - 구체적으로 나누면 **더미, 스텁, 스파이, 목, 페이크** 등이 있음. 크게 나누면 목과 스텁
- 목: 외부로 나가는 상호 작용을 모방하고 검사하는데 도움을 줌. 유사 대역으로 스파이가 있음
- 스텁: 내부로 들어오는 상호 작용을 모방하는데 도움이 됨, 유사 역할로 더미, 페이크가 있음

<img width="443" alt="image" src="https://user-images.githubusercontent.com/4207192/217382399-b51c70e1-d1e9-49e2-8a16-9adec5529907.png">

<img width="443" alt="image" src="https://user-images.githubusercontent.com/4207192/217383628-a046094a-cb34-41ab-9d07-831286ddb091.png">

### 1.1 도구로서의 목과 테스트 대역으로서의 목

- 목은 테스트 대역의 의미로 사용한다고 했지만, 목 라이브러리의 클래스도 목으로 참고할 수 있음
- 실제 목을 만드는데 도움이 되지만, 그 자체로는 목이 아님

```java
void Sending_a_greetings_email() {
    EmailGateway mock = Mockito.mock(EmailGateway.class);
    Controller sut = new Controller(mock);

    sut.GreetUser("user@email.com");
    veryfy(mock, 1).SendGreetingsEmail("user@email.com");
}
```

- Mockito 라이브러리를 이용해 Mock 클래스 생성 -> 테스트 대역을 만들 수 있는 도구
- Mockito를 통해 생성한 mock은 목과 스텁 두 가지 유형으로 생성 가능. **혼동하지 말도록**