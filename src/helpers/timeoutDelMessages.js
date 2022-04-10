async function deleteMessages(messages) {
  if (messages) {
    return Promise.all(messages.map((mes) => mes?.delete())).catch(() => {});
  }

  return null;
}

export async function timeoutDelMessages(time, messages) {
  return new Promise((resolve, reject) =>
    setTimeout(() => deleteMessages(messages).then(resolve).catch(reject), time)
  );
}
