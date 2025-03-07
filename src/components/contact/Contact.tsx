import './Contact.css';
import {FormEvent} from "react";

const Contact = () => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        console.log('Form submitted:', formData);
        // Here you would typically send the data to an API
    };

    return (
        <div className="contact-container">
            <form onSubmit={ handleSubmit }>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" required />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" required />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="comment">Comment</label>
                    <textarea id="comment" name="comment" required></textarea>
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Contact;