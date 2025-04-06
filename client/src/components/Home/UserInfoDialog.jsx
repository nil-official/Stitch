import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputBox from "./InputBox";
import SelectBox from "./SelectBox";

const UserInfoDialog = ({ onClose }) => {
    const [formData, setFormData] = useState({
        height: "",
        weight: "",
        age: "",
        gender: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        console.log("User Info:", formData);
        handleClose();
    };

    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-gray-200/30 backdrop-blur-xl px-14 py-12 rounded-3xl shadow-lg w-2/5"
                    >
                        <h2 className="text-2xl text-white font-bold mb-4">Personalize Your Experience</h2>
                        <div className="px-4 space-y-4">
                            <SelectBox
                                label="Gender"
                                name="gender"
                                placeholder="Pick your identity"
                                onChange={handleChange}
                                options={[
                                    { value: "male", label: "Male" },
                                    { value: "female", label: "Female" },
                                    { value: "other", label: "Other" }
                                ]}
                            />

                            <InputBox label="Height (cm)" name="height" type="number" placeholder="How tall are you?" onChange={handleChange} />
                            <InputBox label="Weight (kg)" name="weight" type="number" placeholder="Your weight in kg?" onChange={handleChange} />
                            <InputBox label="Age" name="age" type="number" placeholder="Enter your age (in years)" onChange={handleChange} />

                            <div className="flex justify-end gap-6 pt-4">
                                <button className="text-white" onClick={handleClose}>
                                    Skip for now
                                </button>
                                <button className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700" onClick={handleSubmit}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UserInfoDialog;