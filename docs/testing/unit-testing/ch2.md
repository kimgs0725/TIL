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

## 2. 단위 테스트의 런던파와 고전파

#### 고전파와 런던파가 의존성을 다루는 방법

## 3. 고전파와 런단파의 비교

#### 한 번에 한 클래스만 테스트하기

#### 상호 연결된 클래스의 큰 그래프를 단위 테스트하기

#### 버그 위치 정확히 찾아내기

#### 고전파와 런던파 사이의 다른 차이점

## 4. 두 분파의 통합 테스트

#### 통합 테스트의 일부인 엔드 투 엔드 테스트

## 5. 요약