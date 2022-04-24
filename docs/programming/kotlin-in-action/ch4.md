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

#### 내부 클래스와 중첩된 클래스: 기본적으로 중첩 클래스

- 클래스 안에 다른 클래스를 선언할 수 있음
- 자바와의 차이는 **중첩 클래스**는 명시적으로 요청하지 않는 한 바깥쪽 클래스 인스턴스에 대한 접근 권한이 없다는 점

```kotlin
interface State: Serializable

interface View {
  fun getCurrentState(): State
  fun restoreState(state: State)
}
```
- `Button` 클래스 상태를 저장하는 클래스는 `Button` 클래스 내부에 선언

```java
public class Button implements View {
  @Override
  public State getCurrentState() {
    return new ButtonState()
  }

  @Override
  public void restoreState(State state) { ... }
  
  public class ButtonState implements State {
    /**
    * ButtonState 클래스 정의
    */
  }
}
```
- `ButtonState`를 직렬화하면 `NotSerializableException` 오류 발생
  - 자바에서 클래스 안에 정의한 클래스는 내부 클래스로 취급
  - 바깥쪽 Button 클래스에 대한 참조를 묵시적으로 포함
  - 그 참조로 인해 `ButtonState`은 직렬화할 수 없음
- 자바에선 이 문제를 해결하기 위해 `static`으로 선언해야함

```kotlin
class Button: View {
  override fun getCurrentState(): State = ButtonState()

  override fun restoreState(state: State) { ... }

  class ButtonState: State {
    /**
    * ButtonState 클래스 정의
    */
  }
}
```
- 코틀린 중첩 클래스에 아무런 변경자가 없으면 자바 static 중첩 클래스와 동일
- 내부 클래스로 변경하여 바깥쪽 참조를 포함하고 싶으면 `inner` 변경자를 붙이면 됨

![image](https://user-images.githubusercontent.com/4207192/164894105-13d0c1d8-a585-4173-8fe9-3becca3ab335.png)

- 내부에서 바깥쪽 클래스를 참조하기 위해서는 `this@Outer`를 통해 참조할 수 있음

#### 봉인된 클래스: 클래스 계층 정의 시 계층 확장 제한

- [2.3.5절에 있는 클래스 계층](https://kimgs0725.github.io/til/docs/programming/kotlin-in-action/ch2#%EC%8A%A4%EB%A7%88%ED%8A%B8-%EC%BA%90%EC%8A%A4%ED%8A%B8-%ED%83%80%EC%9E%85-%EA%B2%80%EC%82%AC%EC%99%80-%ED%83%80%EC%9E%85-%EC%BA%90%EC%8A%A4%ED%8A%B8%EB%A5%BC-%EC%A1%B0%ED%95%A9)을 다시 가져와서
```kotlin
interface Expr
class Num(val value: Int): Expr
class Sum(val left: Expr, val right: Expr): Expr
```
- when 식에서 Num과 Sum이 아닌 경우 else 분기를 넣어야 함

```kotlin
fun eval(e: Expr) {
  when (e) {
    is Num -> e.val
    is Sum -> eval(e.right) + eval(e.left)
    else ->
      throw IllegalArgumentException("Unknown expression")
  }
}
```
- 코틀린은 이 문제를 해결하기 위해 `sealed` 클래스를 제공함
  - `sealed`는 상위 클래스를 상혹한 하위 클래스 정의를 제한시킬 수 있음
```kotlin
sealed class Expr {
  class Num(val value: Int): Expr()
  class Sum(val left: Expr, val right: Expr): Expr()
}

fun eval(e: Expr) {
  when (e) {  // when식에서 모든 하위 클래스를 검사하므로 별도의 else 분기가 없어도 됨
    is Expr.Num -> e.val
    is Expr.Sum -> eval(e.right) + eval(e.left)
  }
}
```

## 2. 뻔하지 않은 생성자와 프로퍼티를 갖는 클래스 선언

- 코틀린에선 생성자를 주 생성자와 부 생성자로 구분
  - 초기화 블록을 통해 초기화 로직을 추가

#### 클래스 초기화: 주 생성자와 초기화 블록

- 클래스 이름 뒤에 오는 괄호로 둘러싸인 코드를 **주 생성자**라고 함
```kotlin
class User constructro (_nickname: String) {  // 파라미터가 하나만 있는 주 생성자
  val nickname: String
  init {    // 초기화 블록
    nickname = _nickname
  }
}
```

- `constructor`는 주 생성자와 부 생성자를 정의내릴 때 사용
- `init`은 초기화 블록을 시작
  - 클래스 안에 여러 초기화 블록을 선언할 수 있음
- 주 생성자 앞에 별다른 애노테이션이나 가시성 변경자가 없다면 `constructor`는 생략 가능

```kotlin
class User(_nickname: String) {
  val nickname = _nickname
}
```

- 주 생성자 파라미터 이름 앞에 `val`을 추가하면 프로퍼티 정의와 초기화를 간략화할 수 있음

```kotlin
class User(val nickname: String)
```

- 함수와 마찬가지로 디폴트 파라미터를 정의할 수 있음
- 인스턴스 생성은 `new` 키워드 없이 생성해야 함
- 상속 시, 부모 클래스로 넘겨야할 파라미터가 있다면 부모클래스 이름 뒤에 괄호치고 생성인자를 넘길 수 있음

```kotlin
open class User(val nickname: String) { ... }

class TwitterUser(nickname: String): User(nickname) { ... }
```

- 부모 클래스에 파라미터가 없더라도, 빈 괄호는 표시해야함
  - 단, 인터페이스의 경우 인스턴스로 생성될 수 없기에 괄호는 표시하지 않음
- 클래스 외부에서 인스턴스화하지 못하게 막고 싶으면 모든 생성자를 private으로 변경하면 됨

```kotlin
class Secretive private constructor() { ... }
```

#### 부 생성자: 상위 클래스를 다른 방식으로 초기화

- 생성자가 많이 필요한 자바와 달리, 코틀린에선 디폴트 파라미터와 이름 붙은 인자 문법으로 오버로드를 해결할 수 있음
- 그럼에도 생성자가 여럿 필요한 경우
  - 프레임워크 클래스를 확장해야 하는데, 여러 가지 방법으로 인스턴스를 초기화할 수 있게 다양한 생성자를 지원해야하는 경우

```kotlin
open class View {
  constructor(ctx: Context) {
    ...
  }

  constructor(ctx: Context, attr: AttributeSet) {
    ...
  }
}
```

- 클래스를 확장하면서 똑같이 부 생성자를 정의할 수 있음

```kotlin
class MyButton : View {
  constructor(ctx: Context) : super(ctx) {
    ...
  }

  constructor(ctx: Context, attr: AttributeSet) : super(ctx, attr) {
    ...
  }
}
```

- `this`를 통해 클래스 자신의 다른 생성자 호출 가능

```kotlin
class MyButton : View {
  constructor(ctx: Context) : this(ctx, MY_STYLE) { // 이 클래스의 다른 생성자에게 위임
  }

  constructor(ctx: Context, attr: AttributeSet) : super(ctx, attr) {
    ...
  }
}

```

- 부 생성자가 필요한 이유는 자바 상호운용성 때문
- 그리고 다른 생성 방법이 여럿 존재하는 경우에도 부 생성자가 필요

#### 인터페이스에 선언된 프로퍼터 구현

