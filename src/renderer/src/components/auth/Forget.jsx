import React, { useState } from 'react';

const Forget = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError('');
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (newPassword !== e.target.value) {
            setPasswordError('Passwords do not match.');
        } else {
            setPasswordError('');
        }
    };

    const handleNext = async () => {
        if (step === 1 && email.trim() !== '') {
            try {
                const response = await window.electron.ipcRenderer.invoke('check-user-exists', email);
                console.log(response);
                if (response.exists) {
                    setStep(2);
                    setEmailError('');
                } else {
                    setEmailError('Email does not exist in our records.');
                }
            } catch (error) {
                setEmailError('Error checking email. Please try again.');
                console.error('Email check error:', error);
            }
        } else if (step === 2 && newPassword.trim() !== '') {
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            setIsSuccess(false);
            return;
        }

        try {
            const response = await window.electron.ipcRenderer.invoke('update-password', { 
                email, 
                newPassword 
            });
            
            if (response.success) {
                setIsSuccess(true);
                setMessage('Password updated successfully! Redirecting to login page...');
                setTimeout(() => {
                    // Add navigation logic here - replace with your actual navigation code
                    window.location.href = '/login';
                }, 2000);
            } else {
                setIsSuccess(false);
                setMessage(response.error || 'Failed to update password. Please try again.');
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage('Error updating password. Please try again.');
            console.error('Password update error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
                <h2 className="text-2xl font-bold text-center mb-6">Forget Password</h2>
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <label className="block text-gray-700 font-medium mb-2">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {emailError && (
                                <p className="text-red-500 text-sm mt-2">{emailError}</p>
                            )}
                            <button
                                type="button"
                                onClick={handleNext}
                                className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <label className="block text-gray-700 font-medium mb-2">Enter Password:</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                required
                                className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="animate-fade-in">
                            <label className="block text-gray-700 font-medium mb-2">Re-Enter Password:</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {passwordError && (
                                <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                            )}
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    )}
                </form>
                {message && (
                    <p className={`mt-4 text-center font-medium ${isSuccess ? 'text-green-800' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Forget;