import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGenerator() {

    const [url, setUrl] = useState('');
    const [qrCode, setQrCode] = useState(null);

    const generateQRCode = () => {
        if (url.trim !== null) {
            setQrCode(url);
        }
    }

    const downloadQRCode = () => {
        if (!qrCode) return;
        const canvas = document.querySelector("canvas");
        if (!canvas) return;

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "qrcode.png";
        link.click();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
            <div className="bg-white/10 backdrop-blur-lg shadow-lg p-8 rounded-2xl border border-white/20 max-w-md w-full text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-200">QR Code Generator</h2>
                <input
                    type="text"
                    placeholder="Enter URL or Text"
                    className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring focus:ring-blue-500 outline-none transition-all"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    onClick={generateQRCode}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
                >
                    Generate QR Code
                </button>

                {qrCode && (
                    <div className="mt-6 flex flex-col items-center">
                        <div className="bg-white p-3 rounded-xl shadow-lg">
                            <QRCodeCanvas value={qrCode} size={200} />
                        </div>
                        <button
                            onClick={downloadQRCode}
                            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
                        >
                            Download QR Code
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
