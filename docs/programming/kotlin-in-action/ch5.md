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

- 람다식을 선언과 동시에 호출할 수 있음.
  - 하지만 이런 구문은 읽기도 힘들고 그다지 쓸모가 없음
  - 대신 `run` 함수를 이용하여 람다를 대신 실행해줄 수 있음

```kotlin
{ println(42) }()
run { println(42) }
```

- 다시 Person 예제로 돌아가서, `mayBy`에 람다함수를 사용하면 다음과 같음

```kotlin
val people = listOf(Person("Alice", 29), Person("Bob", 31))
println(people.maxBy { it.age })    // Person("Bob", 31)
```
- 여기서 정식으로 람다를 풀어서 작성하면 다음과 같음
```kotlin
people.maxBy({ p: Person -> p.age })
```
- 여기서 코틀린은 함수 호출 시 맨 뒤에 있는 인자가 람다식이라면 괄호를 밖으로 빼낼 수 있는 문법 관습이 있음
```kotlin
people.maxBy() { p: Person -> p.age }
```
- 함수의 유일한 인자가 람다라면 빈 괄호도 없앨 수 있음
```kotlin
people.maxBy { p: Person -> p.age }
```
- 파라미터 타입을 없애서 다듬을 수 있음.
  - 이는 컴파일러 단에서 타입을 추론할 수 있기 때문에 없앨 수 있음
```kotlin
people.maxBy { p -> p.age }
```
- 마지막으로 람다의 파라미터 이름을 디폴트 이름인 `it`로 바꾸면 람다 식을 더 간단하게 만들 수 있음
  - 파라미터가 하나뿐이고, 그 타입을 컴파일러가 추론할 수 있는 경우 it을 바로 쓸 수 있음
```kotlin
people.maxBy { it.age }
```
- 만약 람다 안에 람다가 중첩되는 경우 it을 가리키는 파라미터가 어떤 것인지 파악하기 어려움

### 4. 현재 영역에 있는 변수에 접근

- 람다를 함수 안에 정의하면 람다 앞에 선언된 로컬 변수까지 람다에서 사용할 수 있음
```kotlin
fun printMessageWithPrefix(message: Collection<String>, prefix: String) {
  message.forEach {
    println("$prefix $it")
  }
}
```

- 자바와 다른 점
  - 코틀린 람다 안에서는 파이널 변수가 아닌 변수에 접근할 수 있음
  - 바깥의 변수를 변경해도 됨
```kotlin
fun printProblemCouts(responses: Collection<String>) {
  var clientErrors = 0
  var serverErrors = 0
  responses.forEach {
    if (it.startsWith("4")) {
      clientErrors++
    } else if (it.startsWith("5")) {
      serverErrors++
    }
  }
}
```

- 람다함수 안에 사용된 외부 변수를 **람다가 포획한 변수**라고 해서 **포획 변수**라고 함
- 이는 로컬 변수의 생명주기와도 다르게 동작
  - 로컬 변수는 보통 함수가 끝나면 끝남
  - 하지만 포획 변수는 함수가 끝난 뒤에도 람다 본몬에선 여전히 포획 변수를 쓸 수 있음
  - 파이널 변수를 포함한 경우, 람다 코드를 변수 값과 함께 저장