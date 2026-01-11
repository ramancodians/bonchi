import classNames from "classnames";
import QRCode from "react-qr-code";

import Logo from "../assets/logo.png";
import { createQRUrl } from "../utils/formattingUtils";
import { FaPhone } from "react-icons/fa";

interface BonchiCardProps {
  cardNumber?: string;
  holderName?: string;
  validUntil?: string;
  memberId?: string;
  side?: "front" | "back";
}

const BonchiCard = ({
  cardNumber = "XXXX XXXX XXXX XXXX",
  holderName = "Card Holder Name",
  validUntil = "MM/YY",
  memberId = "XXXXXXXXX",
  side = "front",
}: BonchiCardProps) => {
  const url = createQRUrl(memberId);

  const renderOverlay = () => {
    return (
      <div className="absolute w-full h-full rounded-2xl text-white flex items-center justify-center backdrop-blur-xs bg-black/40">
        <div className="flex flex-col justify-center gap-2">
          <div className="flex justify-center">
            <button className="btn btn-outline btn-sm">Activate Card</button>
          </div>
        </div>
      </div>
    );
  };

  const renderBack = () => {
    return (
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div>
          <img src={Logo} className="h-14" alt="" />
        </div>
        <div className="flex flex-1  ">
          <div className="flex flex-1 flex-col justify-center ">
            <div className="border-b border-b-gray-800 pb-1 text-xs">
              <p>
                <span>Name:</span>
                <span className="font-bold">{holderName}</span>
              </p>
              <p>
                <span>Mobile:</span>
                <span className="font-bold">{holderName}</span>
              </p>
              <p>
                <span>Name:</span>
                <span className="font-bold">{holderName}</span>
              </p>
            </div>
            <div className="flex items-center mt-1">
              <FaPhone className="inline-block mr-2" />
              <p className="font-bold text-lg">
                <span>+91</span>
                <span>88773 40892</span>
              </p>
            </div>
          </div>
          <div className=" w-24 flex flex-col justify-center items-center">
            <p className="text-[10px] text-center font-semibold mb-2">
              चलो बनायें स्वस्थ भारत
            </p>
            <div>
              <QRCode value={url} size={58} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFront = () => {
    return (
      <div className="flex items-center justify-center  flex-1">
        <div className="">
          <img
            src={Logo}
            alt="Bonchi Cares"
            className="h-20 mb-4 relative top-3"
          />
        </div>
        <div className="">
          <p className="font-bold text-lg text-bonchi-blue">
            BONCHI HEALTH CARD
          </p>
          <p className="text-bonchi-orange font-black text-sm">
            अब इलाज कराना हुआ आसान।
          </p>
        </div>
      </div>
    );
  };

  const renderLine = () => {
    return (
      <div className="flex gap-2 w-full">
        {[1, 2, 3].map((x) => (
          <div
            className={classNames("h-3 flex-1", {
              "bg-bonchi-blue": x % 2 === 0,
              "bg-bonchi-orange": x % 2 !== 0,
            })}
            key={x}
          ></div>
        ))}
      </div>
    );
  };

  const renderMain = () => {
    return (
      <div className="flex-1 w-full flex flex-col">
        {side === "front" ? renderFront() : renderBack()}
      </div>
    );
  };
  return (
    <div className="flex justify-center items-center p-4 bg-base-100 rounded-xl drop-shadow-2xl flex-col min-h-[220px] max-w-[380px] mx-auto relative">
      {renderOverlay()}
      {renderLine()}
      {renderMain()}
      {renderLine()}
    </div>
  );
};

export default BonchiCard;
