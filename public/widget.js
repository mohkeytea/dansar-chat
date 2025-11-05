const openBtn = document.getElementById("open-chat");
const closeBtn = document.getElementById("close-chat");
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const chatInput = document.getElementById("chat-input");
const chatBody = document.getElementById("chat-body");

openBtn.onclick = () => chatBox.classList.toggle("hidden");
closeBtn.onclick = () => chatBox.classList.add("hidden");

sendBtn.onclick = async () => {
  const msg = chatInput.value.trim();
  if (!msg) return;

  const msgDiv = document.createElement("div");
  msgDiv.textContent = `You: ${msg}`;
  chatBody.appendChild(msgDiv);
  chatInput.value = "";

  await fetch("/api/whatsapp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: "YOUR_CUSTOMER_PHONE", message: msg }),
  });
};
