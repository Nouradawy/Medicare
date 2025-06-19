import { useState } from "react";

export default function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:8080/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        alert("Message sent!");
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} /><br />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} /><br />
            <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} /><br />
            <button type="submit">Send</button>
        </form>
    );
}
