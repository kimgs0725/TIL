---
sidebar_position: 4
---

# 4. 클래스, 객체, 인터페이스

## 1. 클래스 계층 정의

- 코틀린 가시성/접근 변경자는 자바와 비슷하지만 아무것도 지정하지 않는 경우 기본 가시성은 다름
- `sealed`는 클래스 상속을 제한

#### 코틀린 인터페이스

- 코틀린 인터페이스 안에 구현 메소드도 정의할 수 있음
- `interface`로 인터페이스 선언

```kotlin
interface Clickable {
    fun click()
}

class Button: Clickable {
    override fun click() = println("I was clicked")
}
```

- 자바에선 `extends`, `implements` 키워드를 붙이지만, 코틀린은 콜론(:) 뒤에 인터페이스명을 적음
- 자바에서 `@Override` 애노테이션과 비슷한 `override` 변경자가 있음
- 인터페이스 메소드도 디폴트 구현할 수 있음

```kotlin
interface Clickable {
    fun click()
    fun showOff() = println("I'm clickable")
}
```

- 디폴트 메소드를 구현하려는 클래스에선 재정의 해도 되고, 디폴트 메소드를 이용해도 됨

```kotlin
interface Focusable {
    fun setFocus(b: Boolean) =
        println("I ${if (b) "got" else "lost"} focus.")
    fun showOff() = println("I'm focusable")
}
```

- 만약 `Clickable`와 `Focusable`을 구현한다면 어떻게 될까?
    - `showOff()` 메소드를 직접 구현하지 않으면 컴파일러가 어느 인터페이스 구현체를 선택할 지 몰라서 컴파일러 에러를 밷음
    - 컴파일러는 하위 클래스에 두 메소드를 아우르는 구현을 강제화시킴

```kotlin
class Button: Clickable, Focusable {
    override fun click() = println("I was clicked")
    override fun showOff() {
        super<Clickable>.showOff()  // 꺽쇠 괄호에 상위 타입을 지정하여 메소드를 호출할 수 있음
        super<Focusable>.showOff()
    }
}
```
#### open, final, abstract 변경자: 기본적으로 final

