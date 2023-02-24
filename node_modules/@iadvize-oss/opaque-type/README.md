@iadvize/opaque-types
====================
![Continuous integration](https://github.com/iadvize/opaque-type-library/workflows/Continuous%20integration/badge.svg)


Inspired from https://codemix.com/opaque-types-in-javascript/

# Usage

```
npm add @iadvize-oss/opaque-type
```

[📖 Documentation](https://iadvize.github.io/opaque-type-library/)

# Why ? 

## Semantic type checking

The following naive code will compile properly, except that if you mix
`createRoom` parameters you will introduce a nasty bug at runtime.

```typescript
type RoomID = string;
type UserID = string;

function createRoom(roomId: RoomID, userId: UserID) {
  // something
}

const roomId: RoomID = ...;
const userId: UserID = ...;
createRoom(userId, roomId);
```

Opaque at rescue !

This following code won't compile, because `Opaque` add more specificty to
`RoomId` and `UserId`, so typescript wont think they are compatible because they
are built uppon a `string`;

```typescript
import { Opaque } from "@iadvize-oss/opaque-type";

type RoomID = Opaque<"RoomId">;
type UserID = Opaque<"UserId">;

function createRoom(roomId: RoomID, userId: UserID) {
  // something
}

const roomId: RoomID = ...;
const userId: UserID = ...;

createRoom(userId, roomId); // TypeError
```

Here the error message you will get in your editor or when you will try to build
your application

```
Argument of type 'Opaque<"UserId">' is not assignable to parameter of type 'Opaque<"RoomId">'.
  ...
```


## Type opacification (hence the name)

Let say you built a nice piece of code:

```typescript
// message.ts
type Message = {
  userId: string,
  text: string,
};

export function clearMessageText(message: Message) : Message {
  return message.text = '';
}

export function getMessage():Message {
  return ...
}
```

You user can endup writting the following code:

```typescript
import { clearMessageText, getMessage } from './message';

const message = { userId: 'userId', text: 'mytext' };

clearMessageText(message); 

```

or

```typescript
import { getMessage } from '..'

const message2 = getMessage();

message2.userId = 'whatever';
```

Those two pieces of code are problematic, because in these the inner structure
of your types are exposed and manipulated.

If you make any change to the `Message` structure it will be a breaking change
for your code user. Meaning that he could find himself to edit dozen or hundreds
of line of code.

How can we avoid this protecting our user from creating a code strongly tied to
your library internals ?

```typescript
// message.ts
import { createOpaqueAPI } from '../index';

type $Message = {
  userId: string,
  text: string,
};

const { toOpaque, fromOpaque } = createOpaqueAPI<
  'Message',
  $Message,
>('Message');

type Message = ReturnType<typeof toOpaque>;

export function getMessage(): Message {
  return toOpaque({ userId: 'userId', text: 'text' });
}

export function clearMessageText(message: Message): Message {
  const $message = fromOpaque(message)

  return toOpaque({
    ...$message,
    text: '',
  });
}
```

Your user won't be able to write code in same fashion, he will have to ignore
the internals of your code.

```typescript
import { getMessage, clearMessageText } from '../index';

const message = getMessage();

const messageCleared = clearMessageText(message); 
```

This is especially usefull when creating a reusable a library:

- It does protect the user of your code from himself
- It does protect you the maintainer by allowing you to break type structure
  behind the scène without creating a breaking change.
