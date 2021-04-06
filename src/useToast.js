import { getCurrentInstance } from "@vue/runtime-core";

export default () => {
    const toast = getCurrentInstance().ctx.$toast;

    const trigger = (message, type, options = {}) => {
        switch (type) {
            case "success":
                toast.success(message, options);
                break;
            case "error":
                toast.error(message, options);
                break;
            case "warning":
                toast.warning(message, options);
                break;
            case "info":
                toast.info(message, options);
                break;
            default:
                toast.show(message, options);
                break;
        }
    };

    return {
        trigger,
    };
};