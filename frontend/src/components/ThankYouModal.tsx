import { forwardRef, useImperativeHandle, useRef } from "react";

export interface ThankYouModalRef {
  openModal: () => void;
  closeModal: () => void;
}

const ThankYouModal = forwardRef<ThankYouModalRef, ThankYouModalProps>(
  ({ totalChoices }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const openModal = () => {
      dialogRef.current?.showModal();
    };

    const closeModal = () => {
      dialogRef.current?.close();
    };

    useImperativeHandle(ref, () => ({
      openModal,
      closeModal,
    }));

    return (
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-lg md:max-w-xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
              ✕
            </button>
          </form>
          <h3 className="text-secondary mb-4 text-2xl font-bold md:text-3xl">
            Thank you!
          </h3>
          <p className="text-base-content py-4 text-lg md:text-xl">
            I appreciate you taking the time to choose. Your participation makes
            this experiment more interesting and robust. Tell your friends and
            see what they choose!
          </p>
          <p className="text-base-content py-4 text-lg md:text-xl">
            Total choices made:{" "}
            <span className="text-secondary">
              {totalChoices.toLocaleString()}
            </span>
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    );
  },
);

ThankYouModal.displayName = "ThankYou";

interface ThankYouModalProps {
  totalChoices: number;
}

export default ThankYouModal;
