---
sidebar_position: 5 
title: 5. 람다로 프로그래밍
---

## 1. 람다식과 멤버 참조

### 1. 람다 소개: 코드 블록을 함수 인자로 넘기기

- 다음과 같은 일련의 동작을 표현하기 위해 람다가 만들어짐

> "이벤트가 발생하면 이 핸들러를 실행하자"
>
> "데이터 구조의 모든 원소에 이 연산을 적용하자"

- 이를 위해서 자바에선 무명 내부 클래스를 사용
- Kotlin에선 함수를 값처럼 다루는 방법을 채택
- 함수형 언어에선 함수를 직접 다른 함수에 전달할 수 있음
  - 코드는 더욱 더 간결
  - 함수를 선언할 필요 없음

```java
button.setOnClickListener(new OnClickListnener() {
  @Override
  public void onClick(View view) {
    /* 클릭 시 수행할 동작 */
  }
})
```
- 무명 내부 클래스 선언때문에 코드가 더욱 번잡
- 코틀린에선 다음과 같이 선언할 수 있음
```kotlin
button.setOnCliCkListener { /*클릭 시 수행할 동작*/ }
```
- 중괄호 부분이 무명 내부 클래스와 동일한 역할, but 더 간결함
### 2. 람다와 컬렉션
- 컬렉션을 다룰 때 많이 쓰는 패턴들을 라이브러리 형태로 제공

```kotlin
data class Person(val name: String, val age: Int)
```

- `Person` 내에서 가장 연장자를 찾고 싶음
- 람다 사용경험이 없으면 루프를 돌면서 직접 찾음
```kotlin
fun findTheOldest(people: List<Person>) {
  var maxAge = 0
  var theOldest: Person? = null
  for (person in people) {
    if (person.age > maxAge) {
      maxAge = person.age
      theOldest = person
    }
  }
  println(theOldest)
}
```

- 코틀린에선 `maxBy` 함수를 사용
  - `maxBy`: 가장 큰 원소를 찾기 위해 비교에 사용할 값을 인자로 사용
- 단순한 함수나 프로퍼티를 반환하는 역할을 수행하는 람다는 멤버 참조로 대치 가능

```kotlin
people.maxBy(Person::age) // Person::age 멤버 참조
```

### 3. 람다 식의 문법

![image](https://user-images.githubusercontent.com/4207192/169026886-68ca8bae-55c0-4d54-9a56-0e7f7e931765.png)

- 다음과 같은 특징이 있음
  - 중괄호에 둘러 싸여있음
  - 파라미터 목록에 괄호가 없음
  - 화살표를 중심으로 파라미터와 메소드 바디로 나뉨
- 람다 식을 변수에 저장할 수 있음

```kotlin
val sum = { x: Int, y: Int -> x + y }
println(sum(1, 2))
```
