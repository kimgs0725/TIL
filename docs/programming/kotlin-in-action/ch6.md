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
class Address(val streeAddress: String, val zipCode: Int,
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

### 5. 안전한 캐스트: as?

- `is`를 통해 미리 `as`로 변환 가능한 타입인지 검사해볼 수 있음
- `as?` 연산자는 어떤 값을 지정한 타입으로 캐스트함

![image](https://user-images.githubusercontent.com/4207192/174460211-c2e132de-3452-4362-b1b1-4cd4a90f72f9.png)

```kotlin
class Person(val firstName: String, val lastName: String) {
    override fun equals(o: Any?): Boolean {
        val otherPerson = o as? Person ?: return false
        return otherPerson.firstName == firstName &&
            otherPerson.lastName == lastName
    }

    override fun hasCode(): Int =
        firstName.hashCode() * 37 + lastName.hashCode()
}
>>> val p1 = Person("Dmitry", "Jemerov")
>>> val p2 = Person("Dmitry", "Jemerov")
>>> println(p1 == p2)
true
>>> println(p1.equals(42))
false
```

- 안전한 호출, 안전한 캐스트, 엘비스 연산자는 유용해서 코틀린 코드에 자주 사용

### 6. 널 아님 단언: !!
- 느낌표를 이중(!!)으로 사용하여 어떤 값이든 널이 될 수 없는 타입으로 강제로 바꿀 수 있음
- 실제 널에 대해 !!을 적용하면 NPE가 발생

![image](https://user-images.githubusercontent.com/4207192/174460431-a7bfe495-8621-4d95-a985-dcd3ff2359db.png)

```kotlin
fun ignoreNulls(s: String?) {
    val sNotNull: String = s!!
    println(sNotNull.length)
}
>>> ignoreNulls(null)
Exception in thread "main" kotlin.KotlinNullPointerException
```

> !!라고 표시한 이유는 약간 의도한거라고 볼 수 있다.
> 코틀린 설계자들은 컴파일러가 검증할 수 없는 단언을 사용하기 보다는 더 나은 방법을 찾아보라는
> 의도를 넌지시 표현하려고 !!라는 못생긴 기호을 택했다.

- 만약 호출된 함수가 언제나 다른 함수에 널이 아닌 값을 전달한다고 보장된다면 널 아님 단언문을 사용할 수 있음
- !!를 널에 대해 사용해서 발생하는 에외스택 트레이스에 어떤 식에서 예외가 발생햇는지에 대한 정보가 들어있지 않음
    - 그래서 연쇄적으로 !! 단언문을 쓰는 것을 피해야 함
    - `person.company!!.address!!.country`

### 7. let 함수

- `let` 함수를 안전한 호출 연산자와 함께 사용하면 식을 평가해서 결과가 널인지 검사한 뒤, 그 결과를 변수에 넣는 작업을 간단한 식을 사용해 한꺼번에 처리 가능
- `let`을 사용하는 가장 흔한 용례는 널이 될 수 잇는 값을 널이 아닌 값만 인자로 받는 함수에 넘기는 경우

```kotlin
fun sendEmailTo(email: String) { ... }

>>> val email: String? = ...
>>> sendEmailTo(email)
ERROR: Type mismatch: inferred type is String? but String was expected
```

- `sendEmailTo`에 넘기기 위해서는 널인지 검사해야함

```kotlin
if (email != null) sendEmailTo(email)
```
- `let` 함수를 통해 자신의 수신 객체를 인자로 전달받은 람다에게 넘긴다

![image](https://user-images.githubusercontent.com/4207192/174460760-186c85b2-d317-485f-b90b-920080299e85.png)

- 따라서 다음 예제의 람다안에서 널이 될 수 없는 타입으로 `email`을 사용할 수 잇음

```kotlin
email?.let { email -> sendEmailTo(email) }
email?.let { sendEmailTo(it) }  // it를 이용하여 람다식을 짧게 표현할 수 있음
```

```kotlin
fun sendEmailTo(email: String) {
    println("Sending email to $email")
}

>>> var email: String? = "yole@example.com"
>>> email?.let { sendEmailTo(it) }
Sending email to yole@example.com
>>> email = null
>>> email?.let { sendEmailTo(it) }
```

- 여러 값이 널인지 검사하기 위해 `let` 호출을 중첩시킬 수 있음
- 하지만 코드가 복탑해져서 알아보기 가독성이 떨어짐
- 이럴 땐, `if`를 사앙효여 모든 값을 한꺼번에 검사하는 것이 좋음

### 8. 나중에 초기화할 프로퍼티

- 코틀린에서 클래스 안의 널이 될 수 없는 프로퍼티를 생성자 안에서 초기화하지 않고 특별한 메소드 안에서 초기화 할 수 없음
    - 생성자에서 모든 프로퍼티를 초기화해야 함
    - 널이 될 수 없는 타입의 프로퍼티는 반드시 널이 아닌 값으로 초기화

```kotlin
class MyService {
    fun performAction(): String = "foo"
}

class MyTest {
    // null로 초기화하기 위해 널이 될 수 있는 타입인 프로퍼티 선언
    private var myService: MyService? = null

    @Before
    fun setUp() {
        // setUp 메소드 안에서 진짜 초기값을 지정
        myService = MyService()
    }

    @Test
    fun testAction() {
        // 반드시 널 가능성에 신경 써야 함. !!나 ?을 써야함
        assertEquals("foo", myService!!.performAction())
    }
}
```

- 이를 해결하기 위해 `myService` 프로퍼티를 나중에 초기화(Late Initialized)할 수 있음
- `lateinit` 변경자를 붙이면 프로퍼티를 나중에 초기화 할 수 있음

```kotlin
class MyService {
    fun performAction(): String = "foo"
}

class MyTest {
    // 초기화하지 않고 널이 될 수 없는 프로퍼티를 선언
    private lateinit var myService: MyService

    @Before
    fun setUp() {
        // setUp 메소드 안에서 진짜 초기값을 지정
        myService = MyService()
    }

    @Test
    fun testAction() {
        // 널 검사를 수행하지 않고 프로퍼티를 사용
        assertEquals("foo", myService.performAction())
    }
}
```

- 이 때, 나중에 초기화하려는 프로퍼티는 항상 `var`이어야 함
- 프로퍼티를 초기화하기 전에 프로퍼티에 접근하면 `lateinit property myService has not been initialized` 예외 발생

### 9. 널이 될 수 있는 타입 확장#
- 널이 될 수 있는 타입에 대한 확장 함수를 정의하면 null 값을 다루는 강력한 도구로 활용 가능
- 확장 함수의 경우, 직접 변수에 대해 메서드를 호출하면 알아서 널 차리를 해줍니다.

```kotlin
// null이 될 수 있는 수신 객체에 대해 확장 함수 호출
fun verifyUserInput(input: String?) {
    if(input.isNullOrBlank()) {
        println("Please fill in the required fields")
    }
}
verifyUserInput(" ")  // "Please fill in the required fields"
verifyUserInput(null) // "Please fill in the required fields"
```

- 자바에서는 메서드 안의 this는 그 메서드가 호출된 수신 객체를 가리키므로 항상 널이 아님.
- 코틀린에서는 앞에서 살펴본 let 함수도 널이 될 수 있는 타입의 값에 대해 호출할 수 있지만 let은 this가 널인지 검사하지 않음

```kotlin
>>> val person: Person? = ...
>>> person.let { sendEmailTo(it) }
ERROR: Type mismatch: inferred type is Person? but Person was expected
```
- 확장 함수를 작성한다면, 확장 함수를 널이 될 수 있는 타입에 대해 정의할지 여부를 고민할 필요가 있음
- 처음에는 널이 될 수 없는 타입에 대한 확장 함수를 정의
- 나중에 널이 될 수 있는 타입에 대해 호출했다면 여기서 널을 제대로 처리하게 되면 안전하게 그 확장 함수를 널이 될 수 있는 타입에 대한 확장 함수로 바꿀 수 있습니다.

### 10. 타입 파라미터의 널 가능성#

```kotlin
fun <T> printHashCode(t: T) {
    println(t?.hashCode())
}
printHashCode(null) // null, 해당 경우 "T"의 타입은 "Any?"로 추론됩니다.
```
- 타입 파라미터가 널이 아님을 확실히 하려면 널이 될 수 없는 타입 상한(upper bound)를 지정

```kotlin
// 널이 될 수 없도록 상한을 사용합니다.
fun <T: Any> printHashCode(t: T) {  // T는 널이 될 수 없는 타입입니다.
    println(t.hashCode())
}
printHashCode(null) // Error, 이 코드는 컴파일 되지 않습니다.
printHashCode(42)   // 42
```
- 타입 파라미터는 널이 될 수 있는 타입을 표시하려면 반드시 물음표를 타입 이름 뒤에 붙여야 한다는 규칙의 유일한 예외

### 11. 널 가능성과 자바#
- 자바의 경우, 애노테이션으로 널 가능성 정보를 지정할 수 있습니다.
    - `@Nullable Type = Type?`
    - `@NotNull Type = Type`
- 널 가능성 애노테이션이 소스코드에 없는 경우에는 자바의 타입은 코틀린의 플랫폼 타입(platform type)

#### 플랫폼 타입
- 플랫폼 타입은 코틀린이 널 관련 정보를 알 수 없는 타입을 의미

```kotlin
Type = Type? or Type
public class Person {
  private final String anme;
  public Person(String name) { this.name = name; }
  public String getName() { return name; }
}
```
- 위의 코드에서는 코틀린 컴파일러는 String 타입의 널 가능성에 대해 전혀 알지 못함

```kotlin
fun yellAt(person: Person) {
  println(person.name.toUpperCase() + "!!!")
}
yellAt(Person(null))  //   java.lang.IllegalArgumentException: Paramter specified as non-null is null
```

- 코틀린 컴파일러는 공개(public) 가시성인 코틀린 함수의 널이 아닌 타입인 파라미터와 수신 객체에 대한 널 검사를 추가

```kotlin
fun yellAtSafe(person: Person) {
  println((person.name ?: "AnyOne").toUpperCase() + "!!!")
}
yellAtSafe(Person(null))  // ANYONE!!!
```
- 코틀린은 플랫폼 타입을 통해서, 불필요한 널 검사를 줄일 수 있음.
- 특히 제네릭을 다룰 때 상황이 안좋아지기 때문에, 이를 프로그래머에게 책임을 부여하는 실용적인 접근 방법을 사용

```kotlin
val s: String? = person.name  // 자바 프로퍼티를 널이 될 수 있는 타입으로 볼 수 있습니다.
val s1: String = person.name  // 자바 프로퍼티를 널이 될 수 없는 타입으로도 볼 수 있습니다.
```

#### 상속
- 코틀린에서 자바 메서드를 오버라이드할 때 그 메서드의 파라미터와 반환 타입을 **널이 될 수 있는 타입**으로 선언할지 **널이 될 수 없는 타입**으로 선언할지 결정

```kotlin
interface StringProcessor {
    void process(String value);
}

// 코틀린에서 자바 인터페이스를여러 다른 널 가능성으로 구현합니다.
class StringPrinter : StringProcessor {
    override fun process(value: String) {
        println(value)
    }
}

class NullableStringPrinter : StringProcessor {
    override fun process(value: String?) {
        if (value != null) {
            println(value)
        }
    }
}
```
- 자바 클래스나 인터페이스를 코틀린에서 구현할 경우 널 가능성을 제대로 처리하는 일이 중요
- 코틀린 컴파일러는 널이 될 수 없는 타입으로 선언한 모든 파라미터에 대해 널이 아님을 검사하는 단언문을 만들어 줄 수 있음
