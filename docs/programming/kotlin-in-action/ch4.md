---
sidebar_position: 4
title: 4. 클래스, 객체, 인터페이스
---

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

- Effective Java에선 **상속을 위한 설계와 문서를 갖추거나, 그럴 수 없다면 상속을 금지하라**라고 조언함
- 코틀린 클래스와 메소드도 기본적으로 `final`
  - 상속을 허용하려면 클래스 앞에 `open` 변경자 붙여야 함
```kotlin
open class RichButton: Clickable {
  fun disable() {}        // 이 함수는 파이널. 하위 클래스가 오버라이드 X
  open fun animate() {}   // 이 함수는 열려있음. 하위 클래스가 오버라이드 O
  override fun click() {} // 오버라이드 함수. 하위 클래스가 오버라이드 O
  // 만약 오버라이드 함수를 하위 클래스에서 오버라이드를 원치 않는다면 final을 붙임
  final override fun click() {}
}
```

- `abstract` 클래스는 인스턴스화 X
- `abstract` 내 추상 멤버는 항상 open이 기본

```kotlin
abstract class Animated {
  abstract fun animate()  // 추상 멤버는 구현 x, 하위 클래스에서 오버라이드 해야함

  open fun stopAnimating() {} // 비추상 함수는 기본적으로 final. 오버라이드를 원한다면 open 붙임

  fun animateTwice() {}
}
```

|변경자|이 변경자가 붙은 멤버|설명|
|---|---|---|
|final|오버라이드 X|클래스 멤버의 기본 변경자|
|open|오버라이드 O|반드시 open을 명시해야 오버라이드 할 수 있음|
|abstract|반드시 오버라이드 해야함|추상 클래스 멤버에만 적용 가능. 추상 멤버는 구현 X|
|override|상위 클래스, 인스턴스의 멤버를 오버라이드|오버라이드 멤버는 기본적으로 open. 하위 클래스에 오버라이드를 원치 않으면 final 붙임|

#### 가시성 변경자: 기본적으로 공개

- 기존 가시성 변경자는 `public`
- 패키지 전용 가시성 변경자로 `internal`이 있음
  - 모듈 내부에서만 접근 가능
- 최상위 선언에 대해 `private` 가시성을 허용
  - 비공개 기사성인 최상위 선언은 그 선언이 들어있는 파일 내부에서만 사용 가능

|변경자|클래스 멤버|최상위 선언|
|---|---|---|
|public(기본 가시성)|모든 곳에서 볼 수 있음|모든 곳에서 볼 수 있음|
|internal|같은 모듈 안에서만 볼 수 있음|같은 모듈 안에서만 볼 수 있음|
|protected|하위 클래스 안에서만 볼 수 있음|(최상위 선언에 적용할 수 없음)|
|private|같은 클래스 안에서만 볼 수 있음|같은 파일 안에사만 볼 수 있음|
