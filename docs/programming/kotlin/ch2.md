---
sidebar_position: 2
---

# 2. 코틀린 기초

## 1. 기본 요소: 함수와 변수

#### 함수의 특징
```kotlin
fun main(args: Array<String>) {
  println("Hello, World")
}
```
- 함수 선언 시, `fun` 키워드 사용
- 파라미터 이름 뒤에 타입을 작성
- 함수를 최상위 수준에 정의할 수 있음 -> 자바는 클래스 안에서만 선언할 수 있음
- System.out.println -> println으로 제공.
  - 코틀린 표준 라이브러리에서 표준 자바 라이브러리를 간결하게 사용하기 위한 Wrapper를 제공
- 세미클론 X

#### 식이 본문인 함수
```kotlin
// case 1
fun max(a: Int, b: Int): Int {
  return if (a > b) a else b
}

// case 2
fun max(a: Int, b: Int): Int = if (a > b) a else b

// case 3
fun max(a: Int, b: Int) = if (a > b) a else b
```
- `case 2`처럼 함수를 등호와 식으로 구성할 수 있음. 이를 **식이 본문인 함수**라고 함
  - 반대로 `case 1`처럼 중괄호로 이루어진 함수를 **블록으로 이루어진 함수**라고 함
- `case 3`처럼반환 타입도 지정하지 않아도 되는데, **컴파일러가 타입을 분석(타입 추론)**해주기 떄문

#### 변수
```kotlin
val question = "삶, 우주, 그리고 모든 것에 대한 궁극적인 질문" // 타입지정 x -> 컴파일러가 String으로 추론
val answer = 42 // 타입지정 x -> 컴파일러가 Int으로 추론

val answer: Int // 타입을 지정할 수 있음.
answer = 42
```
- 코틀린에선 타입 지정을 생략해도 되는데, 역시 컴파일러가 초기화 식을 분석해서 변수 타입을 지정함
  - 하지만 초기화 식이 없으면 컴파일러가 타입을 지정할 수 없음
- `val`: 변경 불가능한 변수
  - `val` 객체가 불변이더라도 참조가 가리키는 객체의 내부값은 변경될 수 있음
  ```kotlin
  val language = arrayListOf("Java")
  language.add("Kotlin")
  ```
- `var`: 변경 가능한 변수

#### 더 쉽게 문자열 형식 지정: 문자열 템플릿
```kotlin
fun main(args: Array<String>) {
  val name = if (args.size > 0) args[0] else "Kotlin"
  println("Hello, $name")
}
```
- 문자열 템플릿은 문자열에 변수를 지정할 수 있음
- 문자열 안에서 변수 앞에 $을 붙여야 함
- 복잡한 식의 경우 중괄호로 감싸서 사용할 수 있음
  ```kotlin
  fun main(args: Array<String>) {
    if (args.size > 0) {
      println("Hello, ${args[0]}")
    }
  }
  ```

## 2. 클래스와 프로퍼티

```java
public class Person {
  private final String name
  public Person(String name) {
    this.name = name
  }
  public String getName() {
    return this.name
  }
}
```
```kotlin
class Person(name: String)
```
- 자바에서 빈을 표현하기 위해서는 생성자, getter, setter를 선언해야함
  - 이런 보일러 플레이트(반복적으로 찍어내는) 코드를 개선시키기 위해 롬복을 도입하기도 함
- 코틀린에선 보일러 플레이트 코드를 값 객체(value object)라 부르는 객체를 통해 표현 가능

#### 프로퍼티
- 필드와 접근자를 한데 묶어 프로퍼티라 부름
  - 자바에선 접근제어자인 `public`, `private`와 접근자인 `getter`, `setter`를 제공할 수 있음
- 코틀린은 프로퍼티를 언어 기본 기능으로 제공, 프로퍼티가 자바의 필드와 접근자 메소드를 완전히 대체
- `val`와 `var` 키워드를 통해 프로퍼티를 제공
```kotlin
class Person(
  val name: String,       // val: (비공개) 필드, getter 제공
  val isMarried: Boolean  // var: (비공개) 필드, getter, setter 제공
)
```
- 객체 생성 시, `new`를 안쓰고 클래스를 생성
- 객체 바깥에서 getter를 사용할 때에는 필드명을 그대로 호출
- setter도 역시 필드에 assign(=)함
```kotlin
val person = Person("Bob", true)
println("name = ${person.name}, age = ${person.age}")
person.isMarried = false
println("name = ${person.name}, age = ${person.age}")
```
- 프로퍼티 접근자를 커스텀하게 작성할 수 있음
```kotlin
class Rectangle(val height: Int, val width: Int) {
  val isSquare: Boolean   // 프로퍼티 getter 선언
    get() {
      return height == width
    }
}
```