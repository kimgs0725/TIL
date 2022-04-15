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
