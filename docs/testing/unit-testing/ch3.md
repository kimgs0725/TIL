---
sidebar_position: 3
title: 3. 단위 테스트 구조
---

## 1. 단위 테스트를 구성하는 방법

### AAA 패턴 사용
- 준비(Arrange), 실행(Act), 검증(Assert)으로 이루어진 패턴

```java
public class Calculator {
    public double sum(double first, double second) {
        return first + second;
    }
}
```
- 이 메소드를 AAA 패턴으로 테스트 진행

```java
public class CalculatorTests {
    @Test
    void Sum_of_two_numbers() {
        // 준비
        double first = 10;
        double second = 20;
        Calculator calculator = new Calculator();
        
        // 실행
        double result = calculator.sum(first, second);

        // 검증
        assertThat(result).isEqualTo(30);
    }
}
```

- 준비 -> 실행 -> 검증 구조로 일관된 구조
    - 단순하고 균일한 구조를 갖게 되어서 테스트 스위트에 대한 리소스 절감
- AAA 패턴 구조
    - 준비: 테스트 대상 시스템(SUT;System Unit Test)와 의존성을 원하는 상태로 만듦
    - 실행: SUT에서 준비되 의존성과 함께 메소드 호출. 결과값을 캡쳐
    - 검증: 결과를 검증. 반환값이나 SUT와 협력자의 최종 상태, SUT가 협력자에 호출한 메소드 등으로 표시
- Given-When-Then 패턴와 유사. 이건 좀 더 알아보기 쉽다는 장점
    - 현업에선 이걸 더 많이 씀
- TDD(Test Driven Development)을 실천할 때, 먼저 기대하는 동작을 AAA 패턴으로 작성하여 테스트를 작성하고, 이 테스트를 성공하기 위한 코드를 작성

### 여러 개의 준비, 실행, 검증 구절 피하기
- 여러 개의 실행-검증 구조을 보면 여러 개 동작 단위를 검증하는 테스트
- 하나만 실행해서 간단하고, 빠르고, 이해할 수 있도록 단위테스트를 구성하는 게 중요
- 통합 테스트에선 실행 구절을 여러 개 두는 것도 좋을 수 있음
    - 통합 테스트는 테스트를 실행할 때마다 준비하는 과정이 길 수 있기 떄문

### 테스트 내 if문 피하기

- if문이 있는 테스트는 안티 패턴
    - 단위든 통합이든 분기가 없는 일련의 단계여야 함
- if문은 테스트가 한번에 너무 많은 것을 검증한다는 의미
    - 여러 테스트로 나누는 것이 좋음

### 각 구절은 얼마나 커야하나?

- 일반적으로 준비 구절이 가장 큼. 그러나 너무 크면 비공개 메서드나 별도의 팩토리 클래스로 도출하는 것이 좋음
- 준비 구절에서 코드 재사용에 좋은 패턴으로 **오브젝트 마더**와 **테스트 데이터 빌더**가 존재
- 실행 구절을 **한 줄**이어야 함. 2줄 이상인 것은 설계에 문제가 있다는 뜻.

```java
@Test
void Purchase_succeeds_when_enough_inventory() {
    // 준비
    Store store = new Store();
    store.addInventory(Product.Shampoo, 10)
    Custom customer = new Customer();

    // 실행
    bool success = customer.Purchase(store, Product.Shampoo, 5);

    // 검증
    assertThat(success).isTrue();
    assertThat(store.getInventory(Product.Shampoo)).isEqualTo(5);
}
```

- 이 테스트는 실행 구절을 단일 메소드 호출이며 잘 설계된 클래스 API임

```java
@Test
void Purchase_succeeds_when_enough_inventory() {
    // 준비
    Store store = new Store();
    store.addInventory(Product.Shampoo, 10)
    Custom customer = new Customer();

    // 실행
    bool success = customer.Purchase(store, Product.Shampoo, 5);
    store.RemoveInventory(success, Product.Shampoo, 5);

    // 검증
    assertThat(success).isTrue();
    assertThat(store.getInventory(Product.Shampoo)).isEqualTo(5);
}
```

- 실행 구절이 2줄 -> SUT 설계에 문제가 있다는 증거
- 테스트 자체는 문제가 없음.
- 비지니스 관점에서 보면 구매가 정상적으로 이뤄지면 고객의 제품 획득 + 매장 재고 감소가 동시에 일어나야 함
    - 이러한 행위들이 한 트랜잭션 안에서 수행되어야 함
    - 그렇지 않으면 첫번쨰 메소드만 호출하고 두번째 메소드를 호출하지 않을 때 모순이 생김
- 이러한 모순을 불변 위반(Invariant Violation)이라고 함
    - 이러한 모순으로부터 코드를 보호하는 행위를 캡슐화라고 함

### 검증 구절에는 검증문이 얼마나 있어야 하는가?

- 단위 테스트는 동작의 단위, 코드의 단위가 아님
- 따라서 하나의 테스트로 **모든 결과를 평가**하는 것이 좋음
- 그러나, 너무 커지는 것도 경계
    - 그래서 모든 속성을 검증하기 모다는 객체 클래스 내에 적절한 동등 멤버(equality member)를 정의하는 것이 좋음

### 종료 단게를 어떤가?

- 준비, 실행, 검증 이후의 네번째 구절로 종료 구절로 구분하기도 함
    - 작성된 파일을 지우거나, DB 연결을 종료
- 단위 테스트에서는 종료 구절이 필요 X
- 종료 구절을 통합 테스트에서 필요

### 테스트 대상 시스템 구별하기

- SUT는 다른 의존성과 구분하는 것이 중요
- 그래서 SUT 대상 객체의 이름을 sut라고 지정하기도 함

```java
class CalculatorTest {
    @Test
    void Sum_of_two_numbers() {
        // 준비
        double first = 10;
        double second = 20;
        Calculator sut = new Calculator();  // calculator 대신 sut라고 지정
        
        // 실행
        double result = sut.sum(first, second);

        // 검증
        assertThat(result).isEqualTo(30);
    }
}
```

### 준비, 실행 검증 주석 제거하기

- 테스트 내 특정 부분이 어떤 구절에 속해 있는지 파악하는데 만흥ㄴ 시간이 들이지 않도록 세 구절로 나누는 것이 중요
- 주석으로 표시할 수 있지만 다른 방법으로 빈 줄로 분리
```java
class CalculatorTest {
    @Test
    void Sum_of_two_numbers() {
        double first = 10;
        double second = 20;
        Calculator sut = new Calculator();  // calculator 대신 sut라고 지정
        
        double result = sut.sum(first, second);

        assertThat(result).isEqualTo(30);
    }
}
```
- 하지만 대규모 테스트에선 준비 구절에서 설정 구절이 추가될 수 있음