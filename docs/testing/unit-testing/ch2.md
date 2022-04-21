---
sidebar_position: 2
---
# 2. 단위 테스트란 무엇인가?

## 1. 단위 테스트의 정의

- 단위 테스트에 중요한 3가지 속성이 있음
  - 작은 코드 조각(단위)을 검증
  - 빠르게 수행
  - 격리된 방식으로 처리하는 자동화 테스트
- **격리 문제**에 대한 견해에 따라 단위 테스트의 고전파와 런던파 두 분파로 나눠짐

#### 격리 문제에 대한 런던파의 접근

- 런던파에선 **테스트 대상 시스템을 협력자(Collaborator)에게서 격리**하는 것을 의미
  - 이런 식으로 테스트 대상에만 집중할 수 있음

<img width="582" alt="image" src="https://user-images.githubusercontent.com/4207192/163816095-71bbac02-82c0-42a6-bd9c-86d5060d2cb6.png" />

- 런던파를 적용 시 다음과 같은 이점이 있음
  - 테스트가 실패하면 코드베이스의 어느 부분에서 고장 났는지 확실히 알 수 있음
  - 객체 그래프를 분할할 수 있음
    - 의존성들 가진 코드베이스를 테스트하기 위해서 전체 객체 그래프를 만들어야 함
    - 테스트 대역을 사용하면 객체 그래프를 만들지 않아도 됨
  - 클래스 당 하나의 테스트 스위트를 작성하기 때문에 테스트 구조가 간단해짐

    <img width="582" alt="image" src="https://user-images.githubusercontent.com/4207192/163995934-864fecc6-2a70-422c-bf26-5a383bd116e1.png" />
  
- 예시: 고객이 제폼을 구매할 수 있다는 유즈케이스
  - 상점에 재고가 충분 -> 구매는 성공
  - 구매수량만큼 제품 수량이 줄어듦
  - 재고가 충분치 않으면 구매는 실패하고, 상점에선 아무런 일이 일어나지 않음

```java
@Test
public void Purchase_succeeds_when_enough_inventory() {
  // 준비
  Store store = new Store();
  store.addInventory(Product.Shamppo, 10);
  Cusmter customer = new Customer();
  // 실행
  boolean success = customer.Purchase(store, Product.Shampoo, 5);
  // 검증
  assertThat(success).isTrue();
  assertThat(store.getInventory(Product.Shampool)).isEqualTo(5);
}

@Test
public void Purchase_fails_when_not_enough_inventory() {
  // 준비
  Store store = new Store();
  store.addInventory(Product.Shamppo, 10);
  Cusmter customer = new Customer();
  // 실행
  boolean success = customer.Purchase(store, Product.Shampoo, 15);
  // 검증
  assertThat(success).isFalse();
  assertThat(store.getInventory(Product.Shampool)).isEqualTo(10);
}

public enum Product {
  Shampoo, Book
}
```

- 현재 코드는 고전파 스타일로 협력자를 대체하지 않고 운영용 인스턴스를 이용
  - 이 코드를 런던파 스타일로 변경
- Java에서 [Mockito 프레임워크](https://site.mockito.org/)를 이용

```java
@Test
public void Purchase_succeeds_when_enough_inventory() {
  // 준비
  Store storeMock = Mockito.mock(Store.class)
  Mockito.when(storeMock.hasEnoughInventory(Product.Shampoo, 5)).thenReturn(true)
  Cusmter customer = new Customer();
  // 실행
  boolean success = customer.Purchase(storeMock, Product.Shampoo, 5);
  // 검증
  assertThat(success).isTrue();
  verify(storeMock, 1).removeInventory(Product.Shampoo, 5)
}

@Test
public void Purchase_fails_when_not_enough_inventory() {
  // 준비
  Store storeMock = Mockito.mock(Store.class)
  Mockito.when(storeMock.hasEnoughInventory(Product.Shampoo, 5)).thenReturn(false)
  Cusmter customer = new Customer();
  // 실행
  boolean success = customer.Purchase(storeMock, Product.Shampoo, 5);
  // 검증
  assertThat(success).isFalse();
  verify(storeMock, never()).removeInventory(Product.Shampoo, 5)
}
```
- **준비**단계에서 실제 Store 인스턴스를 생성하지 않음
- 대신 `Mockito.mock` 함수를 이용하여 Store 목 오브젝트를 생성
- Store 상태를 수정하는 대신 `hasEnoughInventory` 메서드 호출에 어떻게 응답하는지 정의함
- **검증**단계에서 Store의 상태를 검사하지 않고, Customer에서 Store를 올바르게 호출했는지 확인
  - 호출 여부뿐만 아니라 호출 횟수도 검증 가능

#### 격리 문제에 대한 고전파의 접근

- 고전파에선 **단위 테스트끼리 격리해서 테스트**해야한다고 주장
  - 테스트를 격리하는 건 여러 클래스가 모두 메모리에 상주
  - 공유 상태에 도달하지 않는 한 여러 클래스를 한 번에 테스트해도 괜찮음

> **공유 의존성, 비공개 의존성, 프로세스 외부 의존성**
>
> - 공유 의존성(shared depenedency): 테스트 간에 공유되고 서로의 결과에 영향을 미칠 수 있는 수단을 제공하는 의존성
>> 예: 정적 가변 필드, 데이터베이스 공유 의존성
>
> - 비공개 의존성(private dependency): 공유하지 않는 의존성
>
> - 프로세스 외부 의존성(out-of-process dependency): 애플리케이션 실행 프로세스 외부에서 실행되는 의존성.
>> 예: 데이터베이스(프로세스 외부이면서 공유 의존성), [테스트 컨테이너](https://www.testcontainers.org/)로 올린 데이터베이스(프로세스 외부, 공유하지 않는 의존성)

- 공유 의존성은 단위 테스트 간에 공유
  - 새 파일 시스템, 데이터베이스를 만들 수 없으므로 테스트 간에 공유, 혹은 테스트 대역으로 대체

  <img width="582" alt="image" src="https://user-images.githubusercontent.com/4207192/164218390-bdbadba2-01e8-4d13-889c-ad9781c84816.png" />

- 공유 의존성을 대체함으로써 테스트 실행속도 향상
  - 비공개 의존성에 비해 공유 의존성은 호출이 오래걸림
  - 무엇보다 단위 테스트이기 때문에 빨리 실행해야함
- 공유 의존성을 가진 테스트는 통합테스트에서 진행

## 2. 단위 테스트의 런던파와 고전파

||격리주체|단위의 크기|테스트 대역 사용 대상|
|---|---|---|---|
|런던파|단위|단일클래스|불변 의존성 외 모든 의존성|
|고전파|단위 테스트|단일 클래스 또는 클래스 세트|공유 의존성|

#### 고전파와 런던파가 의존성을 다루는 방법

- Customer(SUT)의 의존성 중 Store는 시간에 따라 변할 수 있는 내부상태를 포함
- 반대로 Product와 5는 테스트 대역으로 대체할 수 없는 것들임
  - 이러한 불변 객체를 **값 객체**, 또는 **값**이라고 함
  - 주요 특징은 정체성이 존재하지 않음
  - 동일한 내용만 갖고 있다면 재사용 가능
- 다시 런던파와 고전파에 대입해서 위 코드를 본다면...
  - 의존성은 공유 의존성과 비공개 의존성으로 나눠짐
    - 데이터베이스는 공유 의존성이며 내부 상태는 자동화된 테스트에서 공유(위 코드에선 공유 의존성은 없음)
  - 비공개 의존성은 변경 가능한 의존성과 값 객체로 나눠짐
    - Store 객체는 변하는 내부 상태를 지닌 변경 가능한 의존성
    - Product는 불변인 비공개 의존성, 즉 값 객체임
- 런던파는 공유의존성과 변경 가능한 의존성에 대해서 테스트 대역으로 대체
- 고전파는 공유의존성에 대해서 테스트 대역을 대체
  - 고전파에서 테스트 대역을 쓰는 이유도 실행 속도 향상을 위해서

  <img width="566" alt="image" src="https://user-images.githubusercontent.com/4207192/164222038-15397fb8-c3fb-45e5-9f39-3dd9e6f9c0cc.png" />

- 모든 프로세스 외부 의존성이 공유 의존성에 속하지 않음(ex. 외부 API)

## 3. 고전파와 런단파의 비교

- 고전파의 단위 테스트가 고품질의 테스트를 만들고 프로젝트의 질을 올려줌
- 반면, 목을 사용하는 런던파의 경우 취약점을 내포하고 있음
- 단, 런던파는 다음과 같은 이점을 제공
  - 입자성이 좋음. 한번에 한 클래스만 확인하기 때문
  - 셔로 연결된 클래스의 그래프가 커져도 테스트하기 쉬움
  - 테스트 실패 시, 어떤 기능이 실패했는지 알기 쉬움

#### 한 번에 한 클래스만 테스트하기

- 좋은 코드 입자성을 목표로 하기 보다는 단일 동작 단위로 검증하는 것이 좋은 테스트
- 이보다 적은 목표로 삼는다면 단위 테스트를 훼손하는 결과를 초래

#### 상호 연결된 클래스의 큰 그래프를 단위 테스트하기

- 물론 여러 클래스 그래프로 연결되어 있는 클래스를 테스트 할 때에는 목을 사용하면 좋음
- 하지만, 설계 관점에서 보면 오히려 여러 클래스 그래프로 연결하도록 설계한 것이 잘못됨
  - 이러한 클래스 그래프를 갖지 않도록 설계하는데 집중

#### 버그 위치 정확히 찾아내기

- 런던파에 비해 고전파 방식에선, 오작동하는 클래스를 참조하는 클라이언트를 대상으로 하는 테스트도 실패할 수 있음
- 하지만 테스트를 정기적으로 수행하면 원인을 쉽게 찾을 수 있음
- 오히려 테스트 스위트 전체에 걸쳐 계단식으로 실패하는 데 가치가 있음
  - 버그가 테스트 하나뿐만 아니라 많은 테스트에서 결함으로 이어진다면, 방금 고장앤 코드 조각이 큰 가치가 있었음을 방증

#### 고전파와 런던파 사이의 다른 차이점

- 두 분파간의 남아있는 두가지 차이점을 다음과 같음
  - 테스트 주도 개발(Test-Driven Development)을 통한 시스템 설계 방식
  - 과도한 명세 문제
- 런던파는 하향식 TDD로 이어짐(상위 클래스부터 목을 통해 하위 클래스까지 구현)
- 고전파는 상향식 TDD(도메인 모델을 시작으로 최종 소프트웨어까지 개발해 나감)
- 과도한 명세 문제는 테스트가 SUT의 구현 세부 사항에 결합됨
  - 이는 목 사용의 문제점으로 이어짐

## 4. 두 분파의 통합 테스트

- 통합 테스트는 아래 기준 중 하나를 충족하지 않는 테스트
  - 단일 동작 단위를 검증
  - 빠르게 수행
  - 다른 테스트와 별도로 처리
- 추가로 둘 이상의 동작 단위를 검증할 때의 테스트이기도 함
- 시스템 전체를 검증, 소프트웨어 품질을 기여하는데 중요한 역할

#### 통합 테스트의 일부인 엔드 투 엔드 테스트

- 조직 내 다른 팀이 개발한 코드 등과 통합해 작동하는지 검증하는 테스트
- 엔드 투 엔드가 통합테스트에 비해 의존성을 많이 포함
- UI 테스트, GUI 테스트, 기능 테스트라고도 함

  <img width="566" alt="image" src="https://user-images.githubusercontent.com/4207192/164435002-23bbdc0a-4016-4ea5-8f72-b3267c105944.png" />

## 5. 요약

- 단위테스트는 단일 동작을 검증하고, 빠르게 수행하고, 다른 테스트와 별도로 처리하는 테스트를 의미
- 격리 문제로 런던파와 고전파로 나뉨
- 런던파는 입자성, 큰 그래프에 대한 테스트, 버그를 쉽게 찾을 수 있다는 장점이 있음
- 하지만 과잉 명세로 인해 SUT에 세부 구현이 결합된 것이 문제
- 통합 테스트는 단위 테스트 기준 중 1개 이상을 충족하지 못한 테스트
- 엔트 투 엔드도 통합테스트의 일부