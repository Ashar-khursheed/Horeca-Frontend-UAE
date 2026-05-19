import { Modal } from "@/components/modal";
import RestaurantForm from "@/components/restaurant-form";

interface FinancingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const FinancingModal = ({ isOpen, onClose, title }: FinancingModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      showFooter={false}
      width="max-w-2xl"
      footerBtnText="Save Address"
    >
      <RestaurantForm onClose={onClose} type="Business" />
    </Modal>
  );
};

export default FinancingModal;
