import Layout from "../../components/Layout";
import Card from '../../components/Card';
import { Input, Label, Button, Error } from "../../components/Form";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import toaster from "toasted-notes";
export default function Register() {
    const router = useRouter();
    const [errors, setErrors] = useState([]);
    const [form, setForm] = useState({
        email: '', password: '', password_confirmation: '', token: router.query.token
    });
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.post('reset-password', form);
            toaster.notify('Your password has been reset', {
                position: 'bottom-right'
            });
            router.replace('/login');
        } catch (r) {
            setErrors(r.response.data.errors);
        }
    };
    useEffect(() => {
        setForm(form => ({ ...form, token: router.query.token }));
    }, [router.query.token]);
    return (
        <Layout middleware="guest" title="Reset Password">
            <div className="mx-auto max-w-screen-sm px-4">
                <Card header={
                    <>
                        <h1 className="text-gray-800 text-xl font-semibold">
                            Reset Password
                        </h1>
                        <p className="text-sm text-gray-500">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                    </>
                }>
                    <form onSubmit={submitHandler}>
                        <input type="hidden" name="token" value={form.token} />
                        <div className="mb-5">
                            <Label htmlFor="email">Email</Label>
                            <Input value={form.email} onChange={(e) => setForm(form => ({ ...form, email: e.target.value }))} type="email" name="email" id="email" />
                            {errors && errors.email && <Error message={errors.email} />}
                        </div>
                        <div className="mb-5">
                            <Label htmlFor="password">password</Label>
                            <Input value={form.password} onChange={(e) => setForm(form => ({ ...form, password: e.target.value }))} type="password" name="password" id="password" />
                            {errors && errors.password && <Error message={errors.password} />}
                        </div>
                        <div className="mb-5">
                            <Label htmlFor="password">Confirm Password</Label>
                            <Input value={form.password_confirmation} onChange={(e) => setForm(form => ({ ...form, password_confirmation: e.target.value }))} type="password" name="password_confirmation" id="password_confirmation" />
                        </div>
                        <Button>Reset Password</Button>
                    </form>
                </Card>
            </div>
        </Layout>
    );
}
