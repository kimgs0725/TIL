---
sidebar_position: 6
title: 6. 코틀린 타입 시스템
---

## 1. 널 가능성

- `NullPointerException` 오류를 피할 수 잇게 도와주는 코틀린 타입 시스템 특성
- 최신 언어에서 `null`에 대한 문제를 런타임에서 컴파일 타임으로 옮기는 중
- 컴파일러가 미리 감지해서 실행 시점에 발생할 수 있는 예외의 가능성을 줄일 수 있음

### 1. 널이 될 수 있는 타입

- 코틀린 타입 시스템이 널이 될 수 있는 타입을 명시적으로 지원
    - 널이 될 수 있는 타입은 프로퍼티나 변수에 null을 허용하게 만듦
    - 반대로 널이 될 수 없는 타입은 컴파일 시점에서 널 여부를 확인하여 컴파일 에러 발생

```kotlin
fun strLen(s: String) = s.length

>>> strLen(null)
ERROR: Null can not be a value of a non-null type String
```

- `strLen`은 런타임에 NPE이 발생하지 않음을 알 수 있음
- 널과 문자열을 니자로 받을 수 있게 하려면 타임 이름 뒤에 물음표를 명시
    - `fun strLen(s: String?) = ...`
- 물음표를 붙임으로써 **널이 될 수 있는 타입**이 됨
    - 기본적으로 코틀린 내 타입은 **널이 될 수 없는 타입**
- 널이 될 수 있는 타입의 값이 있다면 수행할 수 있는 연산의 종류가 제한됨

```kotlin
>>> fun strLenSafe(s: String?) = s.length()
ERROR: only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type kottlin.String?
```

- 널이 될 수 없는 값에 널이 될 수 있는 값을 assign 할 수 없음

```kotlin
>>> val x: String? = null
>>> val y: String = x
ERROR: Type mismatch: inferred type is String? but String was expected
```
- 심지어 널이 될 수 없는 파라미터에 널이 될 수 있는 타입도 넘길 수 없음
- 제약이 많다면 널이 될 수 있는 타입으로 무얼 할 수 있을까?
    - 일단 null check을 실시
    - 그러면 컴파일러가 null이 아님을 확인하고 그 이후부터 널이 될 수 없는 타입처럼 사용 가능

```kotlin
fun strLenSafe(s: String?): Int =
    if (s != null) s.length else 0

>>> val x: String? = null
>>> println(strLenSafe(x))
0
>>> println(strLenSafe("abc"))
3
```

### 2. 타입의 의미

- 타입: 분류로써 어떤 값들이 가능한지와 그 타입에 대해 수행할 수 있는 연산의 종류를 결정
    - `double` 타입에 속한 값이라면 어떤 값이든 관계없이 모든 일반 수학 연산 함수를 적용할 수 있음
    - `double` 타입의 변수 연산이 컴파일러 통과 -> 연산이 성공적으로 실행됨을 보장
    - 자바에선 `String` 타입에는 `String`과 `null`을 받을 수 있음.
        - 하지만, 두 값은 전혀 다름
        - `instanceof`에서도 `null`이 `String`이라고 답하지 않음
        - 이는 자바의 타입 시스템이 `null`을 잘 다루지 못하다는 뜻
- 반면, 코틀린은 이 문제는 널이 될 수 있는 타입과 널이 될 수 없는 타입으로 나눔
    - 각 타입의 값에 대해 어떤 연산이 가능할 지 명확히 히애할 수 있음

### 3. 안전한 호출 연산자: ?.

- `?.`은 `null` 검사와 메소드 호출을 한 번의 연산으로 수행
- `s?.toUpperCase()` 연산은 다음 연산을 대체할 수 있음

```kotlin
if (s != null) {
    s.toUpperCase()
} else {
    null
}
```

![image](https://user-images.githubusercontent.com/4207192/174293510-f408c69b-6298-400d-b390-a7250876e583.png)

- `s`가 널이 될 수 있는 타입인 경우 `s?.toUpperCase()` 식의 결과도 `String?`임

```kotlin
fun printAllCaps(s: String?) {
    val allCaps: String? = s?.toUpperCase()
    println(allCaps)
}

>>> printAllCaps("abc")
ABC
>>> printAllCaps(null)
null
```

- 메소드 호출뿐 아니라 프로퍼티를 읽거나 쓸 때도 안전한 호출을 이용

```kotlin
class Employee(val name: String, val manager: Employee?)
fun managerName(employee: Employee): String? = employee.manager?.name

>>> val ceo = Employee("Da Boss", null)
>>> val developer = Employee("Bob Smith", ceo)
>>> println(managerName(developer))
Da Boss
>>> println(managerName(ceo))
null
```
- 객체 그래프 내 널이 될 수 있는 중간 객체가 여러게 있다면 한 식안에서 안전한 호출을 연쇄해서 함께 사용할 수 있음

```kotlin
class Address(val streeAddress: String, val zipCode: int,
              val city: String, val coutry: String)
class Company(val name: String, val address: Address?)
class Person(val name: String, val company: Company?)

fun Person.countryName(): String {
    val country = this.company?.address?.country    // 여러 안전한 호출 연산자를 연쇄해 사용함
    return if (country != null) country else "Unknown"
}
>>> val person = Person("Dmitry", null)
>>> println(person.countryName())
Unknown
```

### 4. 엘비스 연산자: ?:

- 코틀린에선 `null` 대신 사용할 디폴트 값을 지정할 때 편리하게 사용할 수 있는 엘비스 연산자`?:`를 제공

```kotlin
fun foo(s: String?) {
    val t: String = s ?: ""     // "s"가 null이면 결과는 빈 문자열("")임
}
```

![image](https://user-images.githubusercontent.com/4207192/174299191-0811460e-08aa-432d-9ced-4b7de1758ebf.png)

- 이런 패턴을 활용해 `strLenSafe`를 다음과 같이 줄일 수 있음

```kotlin
fun strLenSafe(s: String?): Int = s?.length ?: 0

>>> val x: String? = null
>>> println(strLenSafe(x))
0
>>> println(strLenSafe("abc"))
3
```
- 엘비스 연산자의 우항에는 `return`, `throw` 등의 연산을 넣을 수 잇음

```kotlin
class Address(val streeAddress: String, val zipCode: int,
              val city: String, val coutry: String)
class Company(val name: String, val address: Address?)
class Person(val name: String, val company: Company?)

fun printShippingLabel(person: Person) {
    val country = this.company?.address?.country
        ?: throw IllegalArgumentException("No address")
    with(address) {
        println(streetAddress)
        println("$zipCode $city, $country")
    }
}
>>> val address = Address("Elsestr. 47", "80687", "Munich", "Germany")
>>> val jetbrains = Company("JetBrains", address")
>>> val person = Person("Dmitry", jetbrains))
>>> printShippingLabel(person)
Elsestr. 47
80867 Munich, Germany
>>> printShippingLabel(Person("Alexey", null))
java.lang.IllegalArgumentException: No address
```