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

## 3. 선택 표현과 처리: enum과 when

#### enum 클래스 정의
```kotlin
enum class Color {
  RED, ORANGE, YELLOW, GREEN, BLUE, INDIGO, VIOLET
}
```
- enum은 단순한 값의 열거가 아님. enum 클래스 안에 프로퍼티와 메소드 정의 가능
```kotlin
enum class Color(
  val r: Int, val g: Int, val b: Int
) {
  RED(255, 0, 0), ORANGE(255, 165, 0), YELLOW(255, 255, 0),
  GREEN(0, 255, 0), BLUE(0, 0, 255), INDIGO(75, 0, 130), VIOLET(238, 130, 238);

  fun rgb() = (r * 256 + g) * 256 + b
}
```

#### when으로 enum 클래스 다루기
- if와 마찬가지로 when도 값을 만들어내는 식
- 식이 본문인 함수에 when을 바로 사용할 수 있음
```kotlin
fun getMnemonic(color: Color) {
  when(color) {
    Color.RED -> "Richard"
    Color.ORANGE -> "Of"
    Color.YELLOW -> "York"
    Color.GREEN -> "Gave"
    Color.BLUE -> "Battle"
    Color.INDIGO -> "In"
    Color.VIOLET -> "Vain"
  }
}
```
- 한 분기 안에 여러값을 매치 패턴으로 사용 가능
```kotlin
fun getWarmth(color: Color) {
  when(color) {
    Color.RED,Color.ORANGE,Color.YELLOW, -> "warm"
    Color.GREEN -> "neutral"
    Color.BLUE,Color.INDIGO,Color.VIOLET -> "cold"
  }
}

...

import ch02.colors.Color
import ch02.colors.Color.*

fun getWarmth(color: Color) = when(color) {
    RED,ORANGE,YELLOW, -> "warm"
    GREEN -> "neutral"
    BLUE,INDIGO,VIOLET -> "cold"
  }
```
#### when과 임의의 객체를 함께 사용
```kotlin
fun mix(c1: Color, c2: Color) =
  when(setOf(c1, c2)) {
    setOf(RED, YELLOW) -> ORANGE
    setOf(YELLOW, BLUE) -> GREEN
    setOf(BLUE, VIOLET) -> INDIGO
    else -> throw Exception("Dirty color")
  }
```
- when의 분기 조건은 임의의 객체 허용
  - 자바의 switch 경우 상수만 가능
#### 인자 없는 when 사용
```kotlin
fun mixOptimized(c1: Color, c2: Color) =
  when {
    (c1 == RED && c2 == YELLOW) ||
    (c1 == YELLOW && c2 == RED) -> ORANGE
    (c1 == YELLOW && c2 == BLUE) ||
    (c1 == BLUE && c2 == YELLOW) -> GREEN
    (c1 == BLUE && c2 == VIOLET) ||
    (c1 == VIOLET && c2 == BLUE) -> INDIGO
    else -> throw Exception("Dirty color")
  }
```
- 위의 코드에선 불필요하게 set을 사용하고 있음
  - 최적화 차원에서 분기조건을 작성
  - 코드를 읽기 어려워지지만, 성능 향상을 위해 필요할 수 있음
- when의 인자 없이 작성할 수 있음

#### 스마트 캐스트: 타입 검사와 타입 캐스트를 조합
- 코틀린에선 `is` 키워드를 이용해 변수 타입을 검사
  - 자바의 `instanceof`와 비슷하지만, `instanceof`는 검사만하고 따로 캐스팅하지 않음
- 코틀린은 `is` 키워드로 검사가 되면, 컴파일러가 캐스팅을 해줌
- 이를 **스마트 캐스트**라고 함
```kotlin
interface Expr
class Num(val value: Int): Expr
class Sum(val left: Expr, val right: Expr): Expr

fun eval(e: Expr): Int {
  if (e is Num) {
    val n = e as Num    // e is Num 시점에서 e는 이미 Num으로 캐스팅 됨
    return n.value
  }
  if (e is Sum) {
    return eval(e.right) + eval(e.left) // e is Sum 시점부터 이미 Sum으로 캐스팅. e.right, e.left를 바로 사용할 수 있음
  }
  throw IllegalArgumentException("Unknown expression")
}
```
- if절을 when을 이용하여 리팩토링 할 수 있습니다.
```kotlin
fun eval(e: Expr): Int =
  when (e) {
    is Num -> e.value
    is Sum -> eval(e.right) + eval(e.left)
    else -> throw IllegalArgumentException("Unknown expression")
  }
```

#### if와 when 분기에서 블록 사용
- if나 when 분기에 블록 사용할 수 있음. 그러면 블록의 **마지막 문장**이 블록 전체 결과가 됨
```kotlin
fun eval(e: Expr): Int =
  when (e) {
    is Num -> {
      println("num: ${e.value}")
      e.value   // is Num이라면 블록의 마지막 식인 e.value이 반환
    }
    is Sum -> {
      val left = eval(e.left)
      val right = eval(e.right)
      println("sum: $left + $right")
      left + right  // is Sum이라면 블록의 마지막 식인 left + right이 반환
    }
    else -> throw IllegalArgumentException("Unknown expression")
  }
```

## 대상을 이터레이션: while과 for 루프
- for문의 경우 `for <아이템> in <원소들>` 형태를 취함

#### while 루프
- 자바와 크게 다르지 않음
```kotlin
while (조건) {
  /* ... */
}

do {
  /* ... */
} while (조건)
```

#### 수에 대한 이터레이션: 범위와 수열
- `..`연산자로 시작 값과 끝 값을 연결해서 범위를 만듦
  - `val oneToTen = 1..10`
- 코틀린의 범위는 폐구간(닫힌 구간) 또는 양끝을 포함하는 구간
  - `val oneToTen = 1..10`은 1와 10을 포함하는 구간
```kotlin
fun fizzBuzz(i: Int) = when {
  i % 15 == 0 -> "FizzBuzz"
  i % 3 == 0 -> "Fizz"
  i % 5 == 0 -> "Buzz"
  else -> "$i"
}

for (i in 1..100) {
  println(fizzBuzz(i))
}
```
- 증가값을 설정할 수 있음
  - `step 2`을 통해 2씩 움직일 수 있음
  - `for (i in 1..100 step 2)`
- 역방향 수열을 만들 수 있음
  - `downTo` 키워드 사용
  - `for (i in 100 downTo 1)`
- 끝 값을 포함하지 않는 닫힌 범위를 만들 수 있음
  - `until` 키워드 사용
  - `for (i in 1 until 100)` -> 1부터 99까지 루프를 돔
  - `for (i in 1..99)`와 동일

#### 맵에 대한 이터레이션
```kotlin
val binaryReps = TreeMap<Char, String>()

for (c in 'A'..'F') { // 숫자뿐만 아니라 문자 타입에도 ..연산자를 사용할 수 있음
  val binary = Integer.toBinaryString(c.toInt())
  binaryPage[c] = binary
}

for ((letter, binary) in binaryPage) {
  // 맵에 대해 이터레이션한다. 맵의 키와 값을 두 변수에 각각 대입
  println("$letter = $binary")
}
```
- 자바의 get/put 대신 map[key]나 map[key]=value를 통해 값을 가져오고 세팅할 수 있음

#### in으로 컬렉션이나 범위의 원소 검사
```kotlin
// !in 연산자를 통해 범위안에 속하는지 검사
fun isLetter(c: Char) = c in 'a'..'z' || c in 'A'..'Z'

// !in 연산자를 통해 범위안에 속하지 않는지 검사
fun isNotDigit(c: Char) = c !in '0'..'9'
```
- `in`연산자를 사용해 어떤 값이 범위에 속하는지 검사할 수 있음
- `in`과  `!in` 연산자를 `when` 식에서 사용해도 됨
```kotlin
fun recognize(c: Char) = when(c) {
  in '0'..'9' -> "It's a digit!"
  in 'a'..'z', in 'A'..'Z' -> "It's a letter!"
  else -> "I don't know"
}
```
- 비교 가능한 클래스라면 클래스의 인스턴스 객체를 사용해 범위를 만들 수 있음

## 코틀린의 예외 처리
- 코틀린 예외처리는 자바나 다른 언어의 예외 처리와 비슷
```kotlin
if (percentage !in 0..100) {
  throw IllegalArgumentException(
    "A percentage value must be between 0 and 100: $percentage"
  )
}
```
#### try, catch, finally
```kotlin
fun readNumber(reader: BufferedReader): Int? {  // 함수가 던질 수 있는 예외라고 명시할 필요 없음
  try {
    val line = raeder.readLine()
    return Integer.parseInt()
  }
  catch (e: NumberFormatException) {
    return null
  }
  finally {
    reader.close()
  }
}
```
- 자바와 큰 차이점은 함수 선언 뒤 `throws IOException`을 선언할 필요 없음
- 그리고 코틀린에선 언체크 예외를 구별하지 않음
  - 함수가 던지는 예외를 지정하지 않고 발생한 예외를 잡아내도 되고, 잡아내지 않아도 됨

#### try를 식으로 사용
```kotlin
fun readNumber(reader: BufferedNumber) {
  val number = try {
    Integer.parseInt(reader.readLine())
  } catch (e: NumberFormatException) {
    return
  }
  println(number)
}
```