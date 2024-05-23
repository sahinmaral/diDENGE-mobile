import { Modal } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectModal, toggleModal } from "../../redux/slices/modalSlice";
import ModalContentTypes from "../../enums/ModalContentTypes";
import { useCallback } from "react";
import { default as ModalContainer } from "./Container";
import UpdateNameSurnameModalContent from "./Contents/UpdateNameSurnameModalContent";
import UpdatePasswordModalContent from "./Contents/UpdatePasswordModalContent";
import UpdateProfileImageModalContent from "./Contents/UpdateProfileImageModalContent";
import VerifyCloseAppModalContent from "./Contents/VerifyExitAppModalContent";
import CloseFocusModeModalContent from "./Contents/CloseFocusModeModalContent";
import ToggleNotificationSound from "./Contents/ToggleNotificationSoundModalContent";
import SetFocusMode from "./Contents/SetFocusModeModalContent";
import VerifyExitSocialMediaAddictionLevelIdentification from "./Contents/VerifyExitSocialMediaAddictionLevelIdentificationModalContent"

function Navigator() {
  const modalProperties = useSelector(selectModal);

  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(toggleModal());
  };

  const renderModalContent = useCallback(() => {
    switch (modalProperties.content) {
      case ModalContentTypes.UpdateNameSurname:
        return <UpdateNameSurnameModalContent />;
      case ModalContentTypes.UpdatePassword:
        return <UpdatePasswordModalContent />;
      case ModalContentTypes.UpdateProfileImage:
        return <UpdateProfileImageModalContent />;
      case ModalContentTypes.VerifyCloseApp:
        return <VerifyCloseAppModalContent />;
      case ModalContentTypes.CloseFocusMode:
        return <CloseFocusModeModalContent />;
      case ModalContentTypes.ToggleNotificationSound:
        return <ToggleNotificationSound />
      case ModalContentTypes.SetFocusMode:
        return <SetFocusMode />
      case ModalContentTypes.VerifyExitSocialMediaAddictionLevelIdentification:
        return <VerifyExitSocialMediaAddictionLevelIdentification />
      default:
        return null;
    }
  }, [modalProperties.content]);

  //FIX: Her ne kadar yukarıdaki bileşenlerde StatusBar gizli olarak kalsa da burada Modal açıldığında StatusBar gözüküyor.

  return (
    <Modal
      visible={modalProperties.isOpen}
      onRequestClose={handleCloseModal}
      animationType="slide"
      transparent={true}
    >
      <ModalContainer handleCloseModal={handleCloseModal}>
        {renderModalContent()}
      </ModalContainer>
    </Modal>
  );
}

export default Navigator;
