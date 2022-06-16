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