import { FadeLoader } from "react-spinners";

const Spinners = () => {
  return (
    <div className="flex justify-center items-center w-[32%] aspect-square">
      <span>
        <FadeLoader size={40} />
      </span>
    </div>
  );
};

export default Spinners;
