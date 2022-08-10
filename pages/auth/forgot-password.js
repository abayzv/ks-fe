import Card from '../../components/Card';
import Container from '../../components/Container';
import Layout from '../../components/Layout';
import { Input, Label, Button, Error } from '../../components/Form';
import { useState } from 'react';
import axios from 'axios';
import toaster from 'toasted-notes';

export default function ForgotPassword() {
    const [errors, setErrors] = useState([]);
    const [email, setEmail] = useState('');
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('forgot-password', { email });
            toaster.notify(data.message, {
                position: 'bottom-right',
            });
        } catch (r) {
            setErrors(r.response.data.errors);
        }
    };
    return (
        <Layout title="Forgot Password">
            <Container>
                <div className="max-w-screen-sm mx-auto">
                    <Card header="Forgot Password">
                        <form onSubmit={submitHandler}>
                            <div className="mb-5">
                                <Label htmlFor="email">Email</Label>
                                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" />
                                {errors && errors.email && <Error message={errors.email} />}
                            </div>
                            <Button type="submit">Send Password Reset Link</Button>
                        </form>
                    </Card>
                </div>
            </Container>
        </Layout>
    );
}
