import { useState } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import InputBox from "./InputBox";
import SelectBox from "./SelectBox";
import { updateProfile } from "../../redux/customer/profile/action";

const UserInfoDialog = ({ profile, onClose }) => {

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        gender: profile.gender || '',
        dob: profile.dob || '',
        height: profile.height || '',
        weight: profile.weight || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getChangedFields = () => {
        const changed = {};
        for (const key in formData) {
            if (formData[key] !== profile[key]) {
                changed[key] = formData[key];
            }
        }
        return changed;
    };

    const handleSubmit = () => {
        const updatedData = getChangedFields();
        if (Object.keys(updatedData).length > 0) dispatch(updateProfile(updatedData));
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
                                selectedValue={formData.gender || ''}
                                onChange={handleChange}
                                options={[
                                    { value: "male", label: "Male" },
                                    { value: "female", label: "Female" },
                                    { value: "other", label: "Other" }
                                ]}
                            />

                            <InputBox
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                value={formData.dob && format(new Date(formData.dob), "yyyy-MM-dd")}
                                onChange={handleChange}
                            />

                            <InputBox
                                label="Height (cm)"
                                name="height"
                                type="number"
                                placeholder="How tall are you?"
                                value={formData.height || ''}
                                onChange={handleChange}
                            />

                            <InputBox
                                label="Weight (kg)"
                                name="weight"
                                type="number"
                                placeholder="Your weight in kg?"
                                value={formData.weight || ''}
                                onChange={handleChange}
                            />

                            <div className="flex justify-end gap-6 pt-4">
                                <button className="text-white" onClick={handleClose}>
                                    Skip for now
                                </button>
                                <button
                                    className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700"
                                    onClick={handleSubmit}
                                >
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