import * as v from "jsr:@valibot/valibot"; // 1.24 kB

const SendMessageSchema = v.objectAsync({
  content: v.pipe(v.string(), v.maxLength(1000)),
});

export default SendMessageSchema;
