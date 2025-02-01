import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

// Enhanced Screenshot Editor Modal with text overlay editing.
const ScreenshotEditorModal = ({ screenshot, onClose }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [texts, setTexts] = useState([]); // Array of text overlays
  const [draggingTextId, setDraggingTextId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Load the screenshot onto the canvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && screenshot) {
      const context = canvas.getContext('2d');
      setCtx(context);
      const img = new Image();
      img.src = screenshot;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
        // After drawing the image, redraw any text overlays
        texts.forEach(drawText);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenshot]);

  // Draw a text overlay on the canvas.
  const drawText = (textObj) => {
    if (ctx) {
      ctx.font = '24px sans-serif';
      ctx.fillStyle = 'red';
      ctx.fillText(textObj.text, textObj.x, textObj.y);
    }
  };

  // Redraw image and text overlays.
  const redrawCanvas = () => {
    if (!ctx) return;
    const canvas = canvasRef.current;
    const img = new Image();
    img.src = screenshot;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      texts.forEach(drawText);
    };
  };

  // Freehand drawing (optional, if needed).
  const startDrawing = (e) => {
    setDrawing(true);
    if (ctx) {
      ctx.beginPath();
      const rect = canvasRef.current.getBoundingClientRect();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e) => {
    if (!drawing || !ctx) return;
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
    if (ctx) {
      ctx.closePath();
    }
  };

  // Add new text overlay.
  const handleAddText = () => {
    const newText = prompt('Enter text to add:');
    if (newText) {
      const newId = Date.now();
      const newTextObj = { id: newId, text: newText, x: 50, y: 50 };
      setTexts((prev) => {
        const updated = [...prev, newTextObj];
        setTimeout(redrawCanvas, 0);
        return updated;
      });
    }
  };

  // Check if a click is within a text box (approximate bounding box)
  const getTextAtPosition = (x, y) => {
    // Using an approximate box size for text
    for (let i = texts.length - 1; i >= 0; i--) {
      const textObj = texts[i];
      // Here we approximate the bounding box as 200x30 px.
      if (x >= textObj.x && x <= textObj.x + 200 && y >= textObj.y - 30 && y <= textObj.y) {
        return textObj;
      }
    }
    return null;
  };

  // Mouse events for dragging text overlays.
  const handleCanvasMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickedText = getTextAtPosition(x, y);
    if (clickedText) {
      setDraggingTextId(clickedText.id);
      setDragOffset({ x: x - clickedText.x, y: y - clickedText.y });
    } else {
      startDrawing(e);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (draggingTextId !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      setTexts((prev) =>
        prev.map((txt) =>
          txt.id === draggingTextId ? { ...txt, x: newX, y: newY } : txt
        )
      );
      redrawCanvas();
    } else {
      draw(e);
    }
  };

  const handleCanvasMouseUp = (e) => {
    setDraggingTextId(null);
    stopDrawing();
  };

  // Allow editing of a text overlay on double-click.
  const handleCanvasDoubleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickedText = getTextAtPosition(x, y);
    if (clickedText) {
      const newText = prompt('Edit text:', clickedText.text);
      if (newText !== null) {
        setTexts((prev) =>
          prev.map((txt) =>
            txt.id === clickedText.id ? { ...txt, text: newText } : txt
          )
        );
        setTimeout(redrawCanvas, 0);
      }
    }
  };

  // Save the edited screenshot with overlays.
  const handleSave = () => {
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'edited-screenshot.png';
    link.href = dataUrl;
    link.click();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-full">
        <h2 className="text-xl font-bold mb-4">Screenshot Editor</h2>
        <div className="mb-2 flex gap-2">
          <button onClick={handleAddText} className="px-4 py-2 bg-blue-600 text-white rounded">
            Add Text
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">
            Save Edited Image
          </button>
        </div>
        <canvas
          ref={canvasRef}
          className="border"
          style={{ cursor: draggingTextId !== null ? 'move' : 'crosshair' }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onDoubleClick={handleCanvasDoubleClick}
        />
      </div>
    </div>
  );
};

const SocialMediaStudio = () => {
  const [content, setContent] = useState({
    platform: 'twitter',
    twitter: {
      username: 'YourUsername',
      handle: '@yourhandle',
      text: 'This is a sample tweet. Customize it for your needs!',
      likes: '2.5K',
      retweets: '1.2K',
      comments: '500',
      linkedinShares: '300',
      youtubeViews: '5K',
      time: '2h',
      image: null,
      profileImage: null,
    },
    instagram: {
      username: 'yourinstagram',
      location: 'New York, NY',
      caption: '✨ Living my best life! #instagram',
      likes: '12,345',
      comments: '789',
      image: null,
      profileImage: null,
    },
    email: {
      subject: 'Important Update Regarding Your Account',
      sender: 'support@company.com',
      body: 'Dear User,\n\nWe wanted to inform you about important changes...',
      image: null,
    },
    style: {
      twitter: {
        backgroundColor: '#15202B',
        textColor: '#FFFFFF',
        accentColor: '#1DA1F2',
      },
      instagram: {
        backgroundColor: '#FFFFFF',
        textColor: '#262626',
        accentColor: '#E1306C',
      },
      email: {
        backgroundColor: '#FFFFFF',
        textColor: '#333333',
        accentColor: '#2563EB',
      },
    },
    studio: {
      logo: null,
    },
  });

  const previewRef = useRef(null);
  const [showEditor, setShowEditor] = useState(false);
  const [screenshotImage, setScreenshotImage] = useState(null);

  // General image upload handler for different fields.
  const handleImageUpload = (platform, e, field = 'image') => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (platform === 'studio') {
          setContent((prev) => ({
            ...prev,
            studio: { ...prev.studio, logo: reader.result },
          }));
        } else {
          setContent((prev) => ({
            ...prev,
            [platform]: { ...prev[platform], [field]: reader.result },
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Export the preview using html2canvas.
  const handleExport = async () => {
    const element = previewRef.current;
    const canvas = await html2canvas(element, {
      useCORS: true,
      backgroundColor: null,
      scale: 2,
    });
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${content.platform}-design.png`;
    link.href = dataUrl;
    link.click();
    setScreenshotImage(dataUrl);
  };


  // Twitter preview with additional metrics.
  const TwitterPreview = () => {
    const currentContent = content.twitter;
    const currentStyle = content.style.twitter;
    return (
      <div
        ref={previewRef}
        className="w-full max-w-2xl rounded-xl p-4 shadow-xl transition-all hover:bg-[#192734]"
        style={{ backgroundColor: currentStyle.backgroundColor }}
      >
        <div className="flex items-center gap-3 mb-4">
          {currentContent.profileImage ? (
            <img
              src={currentContent.profileImage}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white">
              {currentContent.username.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-bold" style={{ color: currentStyle.textColor }}>
              {currentContent.username}
            </h3>
            <p className="text-gray-400 text-sm">{currentContent.handle}</p>
          </div>
        </div>
        <p className="mb-4" style={{ color: currentStyle.textColor }}>
          {currentContent.text}
        </p>
        {currentContent.image && (
          <div className="rounded-xl overflow-hidden border border-gray-700">
            <img
              src={currentContent.image}
              alt="Tweet content"
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4 text-gray-500 mt-4 text-sm">
          <span>{currentContent.time}</span>
          <span>·</span>
          <span>{currentContent.likes} Likes</span>
          <span>·</span>
          <span>{currentContent.retweets} Retweets</span>
          <span>·</span>
          <span>{currentContent.comments} Comments</span>
          <span>·</span>
          <span>{currentContent.linkedinShares} LinkedIn Shares</span>
          <span>·</span>
          <span>{currentContent.youtubeViews} YouTube Views</span>
        </div>
      </div>
    );
  };

  // Render preview based on the selected platform.
  const PlatformPreview = () => {
    switch (content.platform) {
      case 'twitter':
        return <TwitterPreview />;
      case 'instagram':
        return (
          <div
            ref={previewRef}
            className="w-full max-w-md rounded-xl overflow-hidden shadow-xl"
            style={{ backgroundColor: content.style.instagram.backgroundColor }}
          >
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                {content.instagram.profileImage ? (
                  <img
                    src={content.instagram.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    {content.instagram.username.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{content.instagram.username}</h3>
                  <p className="text-gray-500 text-sm">{content.instagram.location}</p>
                </div>
              </div>
            </div>
            {content.instagram.image ? (
              <img
                src={content.instagram.image}
                alt="Instagram post"
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Upload Image</span>
              </div>
            )}
            <div className="p-4">
              <div className="flex gap-4 mb-2">
                <button className="hover:opacity-75">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button className="hover:opacity-75">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              </div>
              <p className="font-semibold mb-1">{content.instagram.likes} likes</p>
              <p>
                <span className="font-semibold">{content.instagram.username}</span>{' '}
                {content.instagram.caption}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                View all {content.instagram.comments} comments
              </p>
            </div>
          </div>
        );
      case 'email':
        return (
          <div
            ref={previewRef}
            className="w-full max-w-2xl rounded-lg shadow-xl overflow-hidden"
            style={{ backgroundColor: content.style.email.backgroundColor }}
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold mb-2">{content.email.subject}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <span>From:</span>
                <span className="font-medium">{content.email.sender}</span>
              </div>
            </div>
            <div className="p-6">
              {content.email.image && (
                <img
                  src={content.email.image}
                  alt="Email content"
                  className="w-full h-48 object-cover mb-6 rounded-lg"
                />
              )}
              <pre className="whitespace-pre-wrap font-sans" style={{ color: content.style.email.textColor }}>
                {content.email.body}
              </pre>
              <div className="mt-6 pt-4 border-t">
                <button
                  className="px-6 py-2 rounded-md font-medium hover:opacity-90"
                  style={{ backgroundColor: content.style.email.accentColor, color: 'white' }}
                >
                  Take Action
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {showEditor && screenshotImage && (
        <ScreenshotEditorModal screenshot={screenshotImage} onClose={() => setShowEditor(false)} />
      )}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Controls Sidebar */}
          <div className="lg:w-96 p-6 bg-gray-50 border-r">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Social Media Studio</h1>
              <div className="flex gap-2">
                {['twitter', 'instagram', 'email'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setContent((prev) => ({ ...prev, platform }))}
                    className={`px-4 py-2 rounded-lg capitalize ${
                      content.platform === platform
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {content.platform === 'twitter' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={content.twitter.username}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          twitter: { ...prev.twitter, username: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tweet Handle</label>
                    <input
                      type="text"
                      value={content.twitter.handle}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          twitter: { ...prev.twitter, handle: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tweet Text</label>
                    <textarea
                      value={content.twitter.text}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          twitter: { ...prev.twitter, text: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Likes</label>
                      <input
                        type="text"
                        value={content.twitter.likes}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            twitter: { ...prev.twitter, likes: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Retweets</label>
                      <input
                        type="text"
                        value={content.twitter.retweets}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            twitter: { ...prev.twitter, retweets: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Comments</label>
                      <input
                        type="text"
                        value={content.twitter.comments}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            twitter: { ...prev.twitter, comments: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">LinkedIn Shares</label>
                      <input
                        type="text"
                        value={content.twitter.linkedinShares}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            twitter: { ...prev.twitter, linkedinShares: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">YouTube Views</label>
                    <input
                      type="text"
                      value={content.twitter.youtubeViews}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          twitter: { ...prev.twitter, youtubeViews: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Tweet Image</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('twitter', e, 'image')}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Profile Image</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('twitter', e, 'profileImage')}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                </>
              )}

              {content.platform === 'instagram' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={content.instagram.username}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          instagram: { ...prev.instagram, username: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Caption</label>
                    <textarea
                      value={content.instagram.caption}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          instagram: { ...prev.instagram, caption: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={content.instagram.location}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          instagram: { ...prev.instagram, location: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Post Image</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('instagram', e)}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Profile Image</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('instagram', e, 'profileImage')}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                </>
              )}

              {content.platform === 'email' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject Line</label>
                    <input
                      type="text"
                      value={content.email.subject}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          email: { ...prev.email, subject: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Body</label>
                    <textarea
                      value={content.email.body}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          email: { ...prev.email, body: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg h-48 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Attach Image</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('email', e)}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={handleExport}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Design
              </button>
         
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 p-8 bg-gray-100 flex items-center justify-center min-h-screen">
            <PlatformPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaStudio;
