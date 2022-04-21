---
sidebar_position: 3
---

# 3. 함수의 정의와 호출

## 1. 코틀린에서 컬렉션 만들기
```kotlin
val set = hashSetOf(1, 7, 53)
val list = arrayListOf(1, 7, 53)
val map = hashMapOf(1 to "one", 7 to "seven", 53 to "fifty-three")
```
- 표준 자바 컬렉션을 활용하기 때문에 자바 코드와의 상호작용이 쉬움
- 코틀린 컬렉션 = 자바 컬렉션
  - 하지만 자바보다 더 많은 기능을 제공(ex. 리스트 마지막 원소 GET, 컬렉션 내 최댓값 구하기 등)

## 2. 함수 호출하기 쉽게 하기
```kotlin
val list = listOf(1, 2, 3)
println(list) // [1, 2, 3] -> 구분자를 세미콜론(;)으로 바꿀 순 없나??
```
- 자바에서 컬렉션 클래스의 디폴트 구현을 변경할려면 서드파티 프로젝트를 추가 후에 관련 로직을 구현해야함(ex. 구아바, 아파치 커먼)
- 코틀린에서 직접 구현해보자. 이후에 코틀린 구현에 맞게 리팩토링
  - 그러면서 코틀린 함수 선언시 제공하는 기능을 알아봄
```kotlin
fun <T> joinToString(
  collection: Collection<T>
  separator: String,
  prefix: String,
  postfix: String
) {
  val result = StringBuilder(prefix)
  for ((index, element) in collection.withIndex()) {
    if (index > 0) result.append(separator)
    result.append(element)
  }
  result.append(postfix)
  return result.toString()
}

val list = listOf(1, 2, 3)
println(joinToString(list, "; ", "(", ")")
```

#### 이름을 붙인 인자
- 함수 호출 시, 함수에 전달하는 인자 중 일부의 이름을 명시할 수 있음
  - 호출 시, 이름을 표기하여 혼동을 막기 위함
```kotlin
val list = listOf(1, 2, 3)
println(joinToString(collection = list, separator = "; ", prefix = "(", postfix = ")")
```

#### 디폴트 파라미터
- 함수 선언에서 파라미터의 디폴트 값을 지정할 수 있음
  - 자바 클래스에 있는 오버로딩 메소드가 많아지는 점을 일부 해결할 수 있음
```kotlin
fun <T> joinToString(
  collection: Collection<T>
  separator: String = ", ",
  prefix: String = "",
  postfix: String = ""
) {
  ...
}
```
- 일반 함수호출처럼 사용하려면 함수 선언할 때 같은 순서로 인자를 정해야함
- 이름 붙여서 함수를 호출한다면 순서와 관계없이 지정할 수 있음
```kotlin
println(joinToString(list, postfix = ";", prefix = "#")) // 중간에 separator는 디폴트 파라미터 사용
```

#### 정적인 유틸리티 클래스 없애기: 최상위 함수와 프로퍼티
- 자바에서 메소드를 만들기 위해서는 항상 클래스를 만들어야함
  - 하지만 정적인 유틸리티 클래스(상태x, 인스턴스 메소드x)를 항상 만들어야함
- 코틀린에선 직접 소스 파일 최상위 수준에 함수를 선언할 수 있음
- 그 함수를 사용하고 싶으면 함수가 정의된 패키지만 임포트하면 됨
```kotlin
package strings
fun joinToString(...): String { ... }

...

import strings

println(joinToString(...))
```
- 하지만 코틀린을 자바 코드로 디컴파일하면 역시 클래스 안 정적 메소드로 선언되어있음
```java
pacakge string
public class JoinKt {
  public static String joinToString(...) { ... }
}
```
- 함수 뿐만 아니라 프로퍼티도 최상위 수준에 놓을 수 있음
```kotlin
var opCount = 0
fun performOperation() {
  opCount++
}
fun reportOperationCount() {
  println("Operation performed $opCount times")
}
```
- 최상위 프로퍼티에 정의한다 해도, 자바 코드상에선 getter 형태로 노출
- 좀 더 자연스럽게 사용하고 싶으면 `const`를 붙이면 됨

```kotlin
const val UNIX_LINE_SEPARATOR = "\n"

/* 자바 */
public static final String UNIX_LINE_SEPARATOR = "\n"
```

## 3. 메소드를 다른 클래스에 추가: 확장 함수와 확장 프로퍼티

- 기존 코드와 코틀린 코드를 자연스럽게 통합하는 것도 코틀린의 목표
- 코틀린에선 **확장 함수(Extension Function)**이 그런 역할을 수행해줌
```kotlin
package strings

// 자바의 String 클래스에 문자열 마지막 문자를 반환하는 확장 함수 작성
fun String.lastChar(): Char = this.get(this.length - 1)
```
- 확장 함수를 만들려면 함수 이름 앞에 그 함수가 확장할 클래스 이름을 덧붙이면 됨
- 클래스 이름을 **수신 객체 타입**, 호출 대상이 되는 객체를 **수신 객체**라고 부름

  ![image](https://user-images.githubusercontent.com/4207192/163537435-d44f607d-02d2-4382-84e2-41f27a08902d.png)
  ```kotlin
  println("Kotlin".lastChar())  // 일반 클래스 멤버 호출하듯이 호출하면 됨
  ```
- 확장 함수 본문에서는 수신 객체(this) 생략 가능
- 하지만 public으로 정의된 메소드, 프로퍼티 말고는 접근할 수 없음

#### 임포트와 확장 함수
- 확장 함수를 사용하기 위해서는 소스코드 내에서 임포트해야함
- *을 이용한 임포트 가능
- as 키워드를 통해 임포트한 클래스, 함수를 다른 이름으로 alias 가능
```kotlin
import string.lastChar
val c = "Kotlin".lastChar()
...
import string.*
val c = "Kotlin".lastChar()
...
import string.lastChar as last
val c = "Kotlin".last()
```
- as 키워드를 이용하여 확장 함수의 이름 충돌을 막을 수 있음
#### 자바에서 확장 함수 호출
- 정적 메소드 형태로 전달받게 됨
```java
/* 확장 함수를 StringUtil.kt에 저장했다면... */
char c = StringUtilKt.lastChar("Java")
```
#### 확장 함수로 유틸리티 함수 정의
- 위에서 알려준 기능들로 joinToString 최종기능 완성
```kotlin
fun <T> Collection<T>.joinToString( // Collection<T>에 대한 확장함수 선언
  separator: String = ", ", // 디폴트 파라미터 선언
  prefix: String = "",      // 디폴트 파라미터 선언
  postfix: String = ""      // 디폴트 파라미터 선언
) : String {
  val result = StringBuilder(prefix)
  for ((index, element) in this.withIndex()) {  // this라는 수신객체. 여기선 T 타입의 원소로 이루어진 컬렉션
    if (index > 0) result.append(separator)
    result.append(element)
  }
  result.append(postfix)
  return result.toString()
}
```
- 확장함수는 정적 메소드 호출에 대한 문법적 편의일 뿐
- 구체적인 타입을 수신 객체 타입으로 지정 가능
```kotlin
fun Collection<String>.join(
  separator: String = ", ",
  prefix: String = "",
  postfix: String = ""
) = joinToString(separator, prefix, postfix)

>>> println(listOf("one", "two", "eight").join(" "))
one two eight
>>> println(listOf(1, 2, 8).join(" "))
에러 발생(Int 컬렉션의 객체 타입에 대해선 join 함수가 정의되어있지 않기 때문)
```

#### 확장함수는 오버라이드 할 수 없다
- 코틀린에서의 오버라이드는 일반 객체지향 언어처럼 오버라이드 가능
  - 하지만 확장함수에 대해서는 오버라이드 불가능

![image](https://user-images.githubusercontent.com/4207192/163702920-59e4dc72-52ee-44bb-a27f-3c9134b7952f.png)

- 클래스의 멤버 함수 중 확장 함수와 이름 및 시그니처가 같다면 멤버함수가 먼저 호출
  - 즉, 멤버 함수의 우선순위가 더 높음
  ```kotlin
  fun View.showOff() = println("I'm a view!")
  fun Button.showOff() = println("I'm a button!")

  val view: View = Button()
  view.showOff()  // I'm a view!
  ```

#### 확장 프로퍼티
- 프로퍼티라는 이름으로 불리긴 하지만 상태를 저장할 방법은 없음
- 하지만 프로퍼티 문법으로 더 짧게 코드를 작성하여 편함
```kotlin
val String.lastChar: Char
  get() = get(length - 1)
```
- 뒷받칠할 필드가 없음. 그래서 기본 getter를 꼭 정의해야함
- 초기화 코드에서 계산한 값을 다믕 장소도 없으므로 초기화 코드도 쓸 수 없음
```kotlin
var StringBuilder.lastChar: Char
  get() = get(length - 1)
  set(value: Char) {
    this.setCharAt(length - 1, value)
  }

>>> println("Kotlin".lastChar)
n
>>> val sb = StringBuilder("Kotlin?")
>>> sb.lastChar = '!'
>>> println(sb)
Kotlin!
```

## 4. 컬렉션 처리: 가변 길이 인자, 중위 함수 호출, 라이브러리 지원

#### 자바 컬렉션 API 확장
```kotlin
>>> val strings: List<String> = listOf("first", "second", "fourteenth")
>>> strings.last()
fourteenth
>>> val numbers: Collection<Int> = setOf(1, 14, 2)
>>> numbers.max
14
```
- 앞 코드에서 사용한 `last`, `max` 함수는 모두 코틀린의 확장함수임
  - 자바에서는 저 함수들을 따로 구현해야 했었음
- 외울 필요없이 IDE에서 자동완성 기능을 지원해주는 그걸 이용하도록 하자

#### 가변 인자 함수: 인자의 개수가 달라질 수 있는 함수 정의
- 가변 길이 인자: 메소드를 호출할 때 원하는 개수만큼 값을 인자로 넣음
  - 컴파일러가 배열에 그 값들을 넣어주는 기능
- 자바에선 타입뒤에 `...`을 붙임. 코틀린은 `vararg` 변경자를 붙임
```kotlin
fun listOf<T>(vararg values: T): List<T> { ... }
```
- 자바에선 배열을 그냥 넘기면 됨
- 하지만 코틀린에선 배열을 명시적으로 풀어서 전달해야함
  - 이를 간편하게 하기 위해 스프레드(Spread) 연산자를 붙임
```kotlin
fun main(args: Array<String>) {
  val list = listOf("args: ", *args)  // *이 스프레드 연산자
  println(list)
}
```

#### 값의 쌍 다루기: 중위 호출과 구조 분해 선언
- 맵을 만들 때 다음과 같이 만들 수 있음
```kotlin
val map = mapOf(1 to "one", 7 to "seven", 53 to "fifty-three")
```
- 여기서 `to`는 코틀린 키워드가 아닌 일반 메소드
- `to`는 특별히 **중위 호출**이라는 특별한 방식으로 호출
```kotlin
1.to("one") // "to" 메소드를 일반적인 방식으로 호출
1 to "one"  // "to" 메소드를 중위 호출 방식으로 호출
```
- 함수를 중위 호출 할 수 있게 하려면 `infix` 변경자를 함수 선언 앞에 추가
```kotlin
infix fun Any.to(other: Any) = Pair(this, other)
```
- 이런 기능을 **구조 분해 선언**이라고 함

![image](https://user-images.githubusercontent.com/4207192/163704345-6e515f33-4687-4b0c-8cc8-232e516ad8d4.png)

- 중위 구조로 이루어진 함수를 풀어서 새로운 순서쌍으로 만듦

## 5. 문자열과 정규식 다루기

- 코틀린은 다양한 확장 함수를 제공함으로써 표준 자바 문자열을 더 즐겁게 다룸
- 일부 혼동됨 메소드에 대해서 코틀린이 명확한 확장 함수를 통해 실수를 줄여줌

#### 문자열 나누기

- 자바에서 `"12.345-6.A".split(".")`의 호출결과는 빈 배열임
  - `split`의 구분 문자열은 **정규식**이고, 마침표는 모든 문자를 나타내는 정규식이기 때문
- 코틀린에선 자바의 `split` 대신 여러 가지 다른 조합의 파라미터를 받는 `split` 확장함수를 제공
  - `String`이 아닌 `Regex` 타입을 값으로 받음
  ```kotlin
  >>> println("12.345-6.A".split("\\.|-".toRegex()))
  [12, 345, 6, A]
  ```
- 굳이 정규식을 쓸 필요 없이 `split` 확장 함수 중 1개 이상 인자를 받는 함수가 존재
  ```kotlin
  >>> println("12.345-6.A".split(".", "-"))
  [12, 345, 6, A]
  ```

#### 정규식과 3중 따옴표로 묶은 문자열
- 코틀린에선 정규식을 사용하지 않고도 문자열을 쉽게 파싱할 수 있음
  - 정규식은 알아보기 힘든 경우가 많음.
```kotlin
fun main() {
    val path = "/Users/yole/kotlin-book/chapter.adoc"
    val regex = """(.+)/(.+)\.(.+)""".toRegex()
    val matchResult = regex.matchEntire(path)
    if (matchResult != null) {
        val (directory, filename, extension) = matchResult.destructured
        println("Dir: $directory, name: $filename, ext: $extension")
    }
}
```
- 3중 따옴표 문자열을 사용해서 정규식을 적용할 때에는 이스케이프할 필요 없음
  - 일반 따옴표: `"(.+)/(.+)\\.(.+)".toRegex()`
  - 3중 따옴표: `"""(.+)/(.+)\.(.+)""".toRegex()`
- 마찬가지로 윈도우 경로 표시할 때에도 3중 따옴표를 쓰면 이스케이프를 쓰지 않아도 됨
  - 일반 따옴표: `"C:\\Users\\yole\\kotlin-book"`
  - 3중 따옴표: `"""C:\Users\yole\kotlin-book"""`
#### 여러 줄 3중 따옴표 문자열
- 3중 따옴표는 줄 바꿈을 표현하는 아무 문자열에도 사용
```kotlin
val kotlinLogo =  """|  //
                    .| //
                    .|/ \
                  """
```
- 프로그래밍 시, 여러 줄 문자열을 테스트의 예상 출력으로 작성할 때 요긴함(특히 html)

## 6. 코드 다듬기: 로컬 함수와 확장
- 코틀린에선 함수에서 추출한 함수를 원 함수 내부에 중첩시킬 수 있음
  - 부가 비용을 들이지 않고 깔끔하게 코드를 조직화할 수 있음
```kotlin
class User(val id: Int, val name: String, val address: String)

fun saveUser(user: User) {
  if (user.name.isEmpty()) {
    throw IllegalArgumentException(
      "Can't save user ${user.id}: empty Name"
    )
  }
  if (user.address.isEmpty()) {
    throw IllegalArgumentException(
      "Can't save user ${user.id}: empty Address"
    )
  }
  // user를 DB에 저장
}
```
- 이런식으로 `name`와 `address`를 검증하는 로직이 중복됨
```kotlin
class User(val id: Int, val name: String, val address: String)

fun saveUser(user: User) {
  fun validate(
      user: User,
      value: String,
      fieldName: String
  ) {
    if (value.isEmpty()) {
      throw IllegalArgumentException(
        "Can't save user ${user.id}: empty $fieldName"
      )
    }
  }
  validate(user, user.name, "Name")
  validate(user, user.address, "Address")
  // user를 DB에 저장
}
```
- 이렇게 `saveUser`안에 검증하는 로직 중복은 제거할 수 있음
- 더 나아가, 로컬 함수는 자신이 속한 바깥함수의 파라미터와 변수를 사용할 수 있음
  - 불필요한 user 파라미터 삭제 가능
```kotlin
class User(val id: Int, val name: String, val address: String)

fun saveUser(user: User) {
  fun validate(
      value: String,
      fieldName: String
  ) {
    if (value.isEmpty()) {
      throw IllegalArgumentException(
        "Can't save user ${user.id}: empty $fieldName"
      )
    }
  }
  validate(user.name, "Name")
  validate(user.address, "Address")
  // user를 DB에 저장
}
```
- 더 개선하고 싶으면 확장 함수로 만들 수 있음
```kotlin
class User(val id: Int, val name: String, val address: String)

fun User.validateBeforeSave() {
  fun validate(
      value: String,
      fieldName: String
  ) {
    if (value.isEmpty()) {
      throw IllegalArgumentException(
        "Can't save user $id: empty $fieldName"
      )
    }
  }
  validate(name, "Name")
  validate(address, "Address")
}

fun saveUser(user: User) {
  user.validateBeforeSave()
  // user를 DB에 저장
}
```
- 하지만 중첨 함수의 깊이가 깊어질수록 코드 가독성은 떨어짐
- 일반적으로 1단계만 중첩시키는 걸 권장

## 7. 요약
- 코틀린은 자체 컬렉션 클래스는 정의 X
- 하지만 자바 클래스를 확장해서 더 풍부한 API 제공
- 함수 파라미터 디폴트값을 정의하면 오버로딩한 함수를 정의할 필요성 감소
- 클래스 멤버가 아닌 최상위 함수와 프로퍼티를 직접 선언할 수 있음
- 확장 함수와 프로퍼티를 사용하면 미리 정의된 클래스의 변경없이 확장할 수 있음
- 중위 호출은 인자가 하나 밖에 없는 메소드나 확장 함수를 더 깔끔한 구문으로 호출
- 정규식과 일반 문자열을 처리할 때 유용한 문법과 처리함수를 제공
- 3중 따옴표를 사용해 이스케이프 없이 문자열을 깔끔하게 표현 가능
- 로컬 함수를 사용해서 코드를 더 깔끔하게 유지하면서 중복을 제거할 수 있음
