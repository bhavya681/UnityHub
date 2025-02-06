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
    discord: {
      username: 'YourDiscordName',
      serverName: 'Awesome Server',
      channelName: 'general',
      message: 'Hey everyone! Check this out...',
      reactions: ['👍', '❤️', '🎉'],
      reactionCounts: ['42', '21', '13'],
      timestamp: '2:30 PM',
      image: null,
      profileImage: null,
    },
    reddit: {
      username: 'YourUsername',
      subreddit: 'r/subreddit',
      title: 'This is a sample Reddit post title',
      text: 'This is the post content or comment. Share your thoughts!',
      upvotes: '2.5k',
      downvotes: '500',
      comments: '324',
      awards: ['Silver', 'Gold', 'Helpful'],
      awardCounts: ['2', '1', '3'],
      time: '4 hours ago',
      flair: 'Discussion',
      image: null,
      profileImage: null,
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
      discord: {
        backgroundColor: '#36393F',
        textColor: '#DCDDDE',
        accentColor: '#5865F2',
        mentionColor: '#7289DA',
        embedColor: '#2F3136'
      },
      reddit: {
        backgroundColor: '#1A1A1B',
        textColor: '#D7DADC',
        accentColor: '#FF4500',
        secondaryColor: '#272729',
        upvoteColor: '#FF4500',
        downvoteColor: '#7193FF',
        linkColor: '#4FBCFF'
      }
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
        className="w-full max-w-2xl bg-black rounded-xl border border-gray-800 hover:bg-[#16181c] transition-all"
      >
        <div className="p-4">
          <div className="flex gap-3">
            {currentContent.profileImage ? (
              <img
                src={currentContent.profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white">
                {currentContent.username.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h3 className="font-bold text-white hover:underline">
                  {currentContent.username}
                </h3>
                <svg viewBox="0 0 22 22" className="w-5 h-5 text-[#1d9bf0]">
                  <path
                    fill="currentColor"
                    d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                  />
                </svg>
                <span className="text-gray-500">@{currentContent.handle}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{currentContent.time}</span>
              </div>
              <p className="text-white mt-1 mb-3">{currentContent.text}</p>
              {currentContent.image && (
                <div className="rounded-xl overflow-hidden border border-gray-800 mb-3">
                  <img
                    src={currentContent.image}
                    alt="Tweet content"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              <div className="flex justify-between text-gray-500 max-w-md">
                <div className="flex items-center gap-1 hover:text-[#1d9bf0]">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      fill="currentColor"
                      d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.045.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.368-3.43-7.788-7.8-7.79zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.334-.75-.75-.75h-.395c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"
                    />
                  </svg>
                  <span>{currentContent.comments}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-green-500">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      fill="currentColor"
                      d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
                    />
                  </svg>
                  <span>{currentContent.retweets}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-pink-500">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      fill="currentColor"
                      d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"
                    />
                  </svg>
                  <span>{currentContent.likes}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-[#1d9bf0]">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      fill="currentColor"
                      d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.073.53-.22c.293-.293.293-.767 0-1.06z"
                    />
                    <path
                      fill="currentColor"
                      d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render preview based on the selected platform.
  const PlatformPreview = () => {
    switch (content.platform) {
      case 'twitter':
        return <TwitterPreview />;
      case 'reddit':
        return (
          <div
            ref={previewRef}
            className="w-full max-w-2xl rounded-lg overflow-hidden"
            style={{ backgroundColor: content.style.reddit.backgroundColor }}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm" style={{ color: content.style.reddit.textColor }}>
                <span className="text-gray-400">Posted by</span>
                <span className="hover:underline">u/{content.reddit.username}</span>
                <span className="text-gray-400">{content.reddit.time}</span>
                {content.reddit.flair && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white">
                    {content.reddit.flair}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-medium mt-2" style={{ color: content.style.reddit.textColor }}>
                {content.reddit.title}
              </h2>

              <div className="mt-3" style={{ color: content.style.reddit.textColor }}>
                {content.reddit.text}
                {content.reddit.image && (
                  <img
                    src={content.reddit.image}
                    alt="Post content"
                    className="mt-3 max-w-full rounded"
                  />
                )}
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm" style={{ color: content.style.reddit.textColor }}>
                <div className="flex items-center gap-1">
                  <button className="hover:bg-gray-700 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1 1 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1 1 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />
                    </svg>
                  </button>
                  <span>{content.reddit.upvotes}</span>
                  <button className="hover:bg-gray-700 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.781 21.625c-.381.475-1.181.475-1.562 0l-8-10A1 1 0 0 1 4 10h4V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v7h4a1 1 0 0 1 .781 1.625l-8 10zM15 12h-1V4h-4v8H6.081L12 19.399 17.919 12H15z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                  </svg>
                  <span>{content.reddit.comments} Comments</span>
                </div>

                <div className="flex items-center gap-2">
                  {content.reddit.awards.map((award, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span>{content.reddit.awardCounts[index]} {award}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'discord':
        return (
          <div
            ref={previewRef}
            className="w-full max-w-md rounded-lg overflow-hidden shadow-xl"
            style={{ backgroundColor: content.style.discord.backgroundColor }}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                {content.discord.profileImage ? (
                  <img
                    src={content.discord.profileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                    {content.discord.username.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: content.style.discord.textColor }}>
                      {content.discord.username}
                    </span>
                    <span className="text-sm text-gray-400">
                      {content.discord.timestamp}
                    </span>
                  </div>
                  <div
                    className="mt-1 text-sm"
                    style={{ color: content.style.discord.textColor }}
                  >
                    {content.discord.message}
                  </div>
                  {content.discord.image && (
                    <div className="mt-2">
                      <img
                        src={content.discord.image}
                        alt="Attached"
                        className="max-w-full rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex gap-1 mt-2">
                    {content.discord.reactions.map((reaction, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 text-sm"
                        style={{ color: content.style.discord.textColor }}
                      >
                        <span>{reaction}</span>
                        <span className="text-xs text-gray-400">
                          {content.discord.reactionCounts[index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
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
            className="w-full max-w-2xl bg-white rounded shadow-sm overflow-hidden"
            style={{ backgroundColor: content.style.email.backgroundColor }}
          >
            <div className="px-4 py-3 border-b flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                  {content.email.sender?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{content.email.sender}</span>
                  <span className="text-gray-500 text-sm">&#60;{content.email.sender}@gmail.com&#62;</span>
                </div>
                <div className="text-gray-500 text-sm flex items-center gap-2">
                  <span>to me</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <button className="hover:bg-gray-100 p-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <h1 className="text-xl mb-4">{content.email.subject}</h1>
              {content.email.image && (
                <img
                  src={content.email.image}
                  alt="Email content"
                  className="w-full max-h-96 object-contain mb-6"
                />
              )}
              <div className="text-gray-800 whitespace-pre-wrap font-sans" style={{ color: content.style.email.textColor }}>
                {content.email.body}
              </div>
              <div className="mt-6 space-x-2">
                <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Reply
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Forward
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
              <div className="flex gap-2 flex-col">
                {['twitter', 'instagram', 'email', 'reddit', 'discord'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setContent((prev) => ({ ...prev, platform }))}
                    className={`px-4 py-2 rounded-lg capitalize  ${content.platform === platform
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
              {content.platform === 'discord' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={content.discord.username}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          discord: { ...prev.discord, username: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      value={content.discord.message}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          discord: { ...prev.discord, message: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Timestamp</label>
                    <input
                      type="text"
                      value={content.discord.timestamp}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          discord: { ...prev.discord, timestamp: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reactions</label>
                    <div className="flex gap-2 flex-wrap">
                      {content.discord.reactions.map((reaction, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={reaction}
                            onChange={(e) => {
                              const newReactions = [...content.discord.reactions];
                              newReactions[index] = e.target.value;
                              setContent((prev) => ({
                                ...prev,
                                discord: { ...prev.discord, reactions: newReactions },
                              }));
                            }}
                            className="w-16 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={content.discord.reactionCounts[index]}
                            onChange={(e) => {
                              const newCounts = [...content.discord.reactionCounts];
                              newCounts[index] = e.target.value;
                              setContent((prev) => ({
                                ...prev,
                                discord: { ...prev.discord, reactionCounts: newCounts },
                              }));
                            }}
                            className="w-16 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Count"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Message Image</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('discord', e, 'image')}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Profile Image</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('discord', e, 'profileImage')}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                </>
              )}
              {content.platform === 'reddit' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={content.reddit.username}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          reddit: { ...prev.reddit, username: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="u/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subreddit</label>
                    <input
                      type="text"
                      value={content.reddit.subreddit}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          reddit: { ...prev.reddit, subreddit: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="r/subreddit"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Post Title</label>
                    <input
                      type="text"
                      value={content.reddit.title}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          reddit: { ...prev.reddit, title: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Post title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Post Text</label>
                    <textarea
                      value={content.reddit.text}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          reddit: { ...prev.reddit, text: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                      placeholder="Post content..."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Upvotes</label>
                      <input
                        type="text"
                        value={content.reddit.upvotes}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            reddit: { ...prev.reddit, upvotes: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="2.5k"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Comments</label>
                      <input
                        type="text"
                        value={content.reddit.comments}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            reddit: { ...prev.reddit, comments: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="324"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Time Posted</label>
                      <input
                        type="text"
                        value={content.reddit.time}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            reddit: { ...prev.reddit, time: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="4 hours ago"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Post Flair</label>
                    <input
                      type="text"
                      value={content.reddit.flair}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          reddit: { ...prev.reddit, flair: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Discussion"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Post Image</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('reddit', e, 'image')}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Profile Image</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('reddit', e, 'profileImage')}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                </>
              )}



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
                    <label className="block text-sm font-medium mb-2">Likes</label>
                    <input
                      type="text"
                      value={content.instagram.likes}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          instagram: { ...prev.instagram, likes: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Comments</label>
                    <input
                      type="text"
                      value={content.instagram.comments}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          instagram: { ...prev.instagram, comments: e.target.value },
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
