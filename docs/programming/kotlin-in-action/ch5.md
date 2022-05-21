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

### 5. 멤버 참조

- 넘기려는 함수가 이미 선언되어있을 떄, 함수를 값으로 전달하면 됨(?)
  - 이중 콜론(::)을 사용. 이걸 **멤버 참조**라고 함
```kotlin
val getAge = Person::age
```
- 이 역시 람다로 풀어쓰면 다음과 같음
```kotlin
val getAge = { person: Person -> person.age }
```
- 멤버 참조는 그 멤버를 호출하는 람다와 같은 타입
- 다음 예처럼 자유롭게 바꿔 쓸 수 있음
```kotlin
people.maxBy(Person::age)
people.maxBy { p -> p.age }
people.maxBy { it.age }
```
- 최상위에 선언된 함수나 프로퍼티도 참조 가능. 클래스 이름을 생략하고 :: 참조로 시작
```kotlin
fun slute() = println("Salute!")
>> run(::salute)
```

- 람다가 인자가 여럿인 다른 하뭇한테 작업을 위임하는 경우, 람다를 정의하지 않고 직접 위임 함수에 대한 참조를 제공하면 편리
```kotlin
val action = { person: Person, message: String ->
  sendEmail(person, message)
}
val nextAction = ::sendEmail
```
- 생성자 참조를 사용하면 클래스 생성 작업을 연기하거나 저장해둘 수 있음
```kotlin
data class Person(val name: String, val age: Int)

>>> val createPerson = ::Person
>>> val p = createPerson("Alice", 29)
>>> println(p)
```

- 확장함수도 멤버 함수와 동일한 방식으로 참조할 수 있음

## 2. 컬렉션 함수형 API

### 1. 필수적인 함수: filter와 map

- filter: 컬렉션을 이터레이션하면서 주어진 람다에 각 원소를 넘겨서 람다가 true를 반환하는 원소를 모음
  ```kotlin
  val list = listOf(1, 2, 3, 4)
  println(list.filter { it % 2 == 0 })  // 2, 4
  ```

  ![image](https://user-images.githubusercontent.com/4207192/169637455-747b2f74-2640-4c82-867c-1e6120652e13.png)

  - 결과가 입력 컬렉션의 원소 중에서 주어진 술어(Predicate)를 만족하는 원소만으로 이뤄진 컬렉션을 반환
  - 반대로 컬렉션에서 원치 않는 원소를 제거
- map: 람다를 컬렉션의 각 원소에 적용한 결과를 모아선 새 컬렉션을 만듦
  ```kotlin
  val list = listOf(1, 2, 3, 4)
  println(list.map { it * it })   // 1, 4, 9, 16
  ```
  ![image](https://user-images.githubusercontent.com/4207192/169637621-dc1f787f-e49d-405b-92bc-b8c36000cadf.png)

  - map 호출을 연속해서 사용할 수 있음. 물론 filter와 연속해서 사용할 수 있음
  ```kotlin
  people.fileter { it.age > 30 }.map(Person::name)
  ```
  - 필요하지 않은 경우 굳이 계산을 반복 금지
    - 람다로 넘기면 겉으로 단순하나, 내부 로직의 복잡도가 증가하여 불합리한 계산식이 될 수 있음
- `map` 컬렉션에서도 filter, map 함수를 사용할 수 있음
```kotlin
val numbers = mapOf(0 to "zero", 1 to "one")
printlnt(numbers.mapValue { it.value.toUpperCase() })
```
- `filterKeys`, `mapKeys`는 키를 걸러내거나 변환, `filterValue`, `mapValue`는 값을 걸러내거나 반환함

### 2. all, any, count, find: 컬렉션에 술어 적용

- 컬렉션의 모든 원소가 어떤 조건을 만족하는지 판단하는 연산
  - count: 조건을 만족하는 원소의 개수를 반환
  - find: 조건을 만족하는 첫 번째 원소를 반환
  - all: 모든 원소가 술어(조건)을 만족하는지 확인
  - any: 원소 중에 조건을 만족하는 원소가 있는지 확인
- 어떤 사람의 나이가 27살 이하인지 판단하는 술어가 있다고 가정
  ```kotlin
  val canBeInClub27 = { p: Person -> p.age <= 27 }
  ```
- 모든 원소가 만족하는지 궁금하면 `all`, 하나라도 만족하는 원소가 있는지 궁금하면 `any`를 사용
  ```kotlin
  val people = listOf(Person("Alice", 27), Person("Bob", 31))
  println(people.all(canBeInClub27))  // false
  println(people.any(canBeInClub27))  // true
  ```
- 원소 개수를 구할려면 count 사용, 만족하는 원소 하나 찾고 싶으면 find를 쓰면 됨
  ```kotlin
  val people = listOf(Person("Alice", 27), Person("Bob", 31))
  println(people.count(canBeInClub27))  // 1
  println(people.find(canBeInClub27))   // Person("Alice", 27)
  ```
- `size`와 `count` 비교
  - 원소의 개수를 구하는 방법은 2가지가 있음
  - `count`를 통해 원소의 개수를 찾음
  - 원하는 조건을 가진 원소만 `filter`해서, 그 컬렉션의 `size`를 구할 수 있음
  - 후자 방식을 중간에 컬렉션을 또 만들어야 함
  - 하지만 전자 방식은 그러지 않아도 됨
    - 만약 원소 개수만 구하고 싶으면 `count`, 원소 개수와 필터링된 컬렉션 결과를 가지고 싶으면 `filter`와 `size`를 사용

### 3. groupBy: 리스트를 여러 그룹으로 이뤄진 맵으로 변경

