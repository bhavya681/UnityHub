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
        <h2 className="text-xl font-bold mb-4">SnapShot Editor</h2>
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
    whatsapp: {
      username: 'John Doe',
      phoneNumber: '+1 (555) 123-4567',
      message: 'Hey! Just wanted to let you know about the meeting tomorrow at 10 AM. Don\'t forget to bring the presentation materials! 📊',
      time: '9:45 AM',
      status: 'delivered', // can be 'sent', 'delivered', 'read'
      isGroup: false,
      groupName: null,
      participants: null,
      unreadCount: 2,
      image: null,
      profileImage: null,
    },
    youtube: {
      channelName: 'Channel Name',
      channelHandle: '@channelhandle',
      subscribers: '1.2M subscribers',
      title: 'This is a sample video title that can be quite long and descriptive',
      description: 'This is the video description. It can contain multiple lines and include hashtags, links and other details about the video content. #youtube #video',
      views: '245K',
      timestamp: '2 weeks ago',
      likes: '15K',
      comments: '1.2K',
      thumbnailImage: null,
      channelAvatar: null,
      duration: '10:15',
      isVerified: true,
      isSponsored: false,
      category: 'Education',
      tags: ['tutorial', 'howto', 'education'],
    }, facebook: {
      username: 'John Smith',
      profileName: 'John Smith',
      verified: true,
      privacy: 'Public', // Can be 'Public', 'Friends', 'Only Me'
      postText: 'Just shared some exciting news! Check out our latest announcement.',
      timestamp: '2 hours ago',
      location: 'San Francisco, California',
      likes: '1.2K',
      comments: '342',
      shares: '156',
      reactions: {
        like: '856',
        love: '234',
        care: '89',
        haha: '45',
        wow: '67',
        sad: '12',
        angry: '8'
      },
      image: null,
      profileImage: null,
      attachments: [], // For multiple media attachments
      taggedPeople: [],
      feeling: null, // Can include feelings/activities
      backgroundStyle: null, // For colored background posts
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
      },
      whatsapp: {
        backgroundColor: '#ECE5DD',
        textColor: '#000000',
        accentColor: '#25D366',
        secondaryColor: '#DCF8C6',
        messageOutColor: '#DCF8C6',
        messageInColor: '#FFFFFF',
        timestampColor: '#667781',
        checkmarkColor: '#4FC3F7'
      },
      youtube: {
        backgroundColor: '#FFFFFF',
        textColor: '#0F0F0F',
        accentColor: '#FF0000',
        secondaryColor: '#606060',
        titleColor: '#0F0F0F',
        descriptionColor: '#606060',
        buttonColor: '#0F0F0F',
        buttonHoverColor: '#272727',
        subscribeButtonColor: '#FF0000',
        subscribeButtonHoverColor: '#CC0000',
        timestampColor: '#606060',
        borderColor: '#E5E5E5',
        verifiedBadgeColor: '#606060',
        sponsoredTagColor: '#606060'
      },
      facebook: {
        backgroundColor: '#FFFFFF',
        textColor: '#1C1E21',
        accentColor: '#1877F2',
        secondaryColor: '#65676B',
        linkColor: '#216FDB',
        reactionBarBackground: '#F0F2F5',
        cardBorder: '#E4E6EB',
        verifiedBadgeColor: '#1877F2',
        buttonColor: '#E4E6EB',
        buttonHoverColor: '#D8DADF',
        buttonTextColor: '#050505',
        iconColor: '#65676B',
        separatorColor: '#CED0D4',
        shadowColor: 'rgba(0, 0, 0, 0.08)'
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
          <div ref={previewRef} className="w-full max-w-2xl bg-white dark:bg-[#1A1A1B] rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Post Header */}
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Posted by</span>
                <div className="flex items-center gap-1 hover:underline cursor-pointer">
                  {content.reddit.profileImage ? (
                    <img 
                      src={content.reddit.profileImage}
                      alt={content.reddit.username}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                  )}
                  <span>u/{content.reddit.username}</span>
                </div>
                <span>{content.reddit.time}</span>
              </div>

              {/* Post Title */}
              <h2 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                {content.reddit.title}
              </h2>

              {/* Post Flair */}
              {content.reddit.flair && (
                <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                  {content.reddit.flair}
                </span>
              )}

              {/* Post Content */}
              <div className="mt-3 text-gray-800 dark:text-gray-300">
                {content.reddit.image && (
                  <img
                    src={content.reddit.image}
                    alt="Post content"
                    className="w-full rounded-lg mb-3"
                  />
                )}
                <p className="whitespace-pre-wrap">{content.reddit.text}</p>
              </div>

              {/* Post Actions */}
              <div className="mt-4 flex items-center gap-4 text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1 1 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1 1 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" fill="currentColor"/>
                    </svg>
                  </button>
                  <span>{content.reddit.upvotes}</span>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.781 21.625c-.381.475-1.181.475-1.562 0l-8-10A1 1 0 0 1 4 10h4V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v7h4a1 1 0 0 1 .781 1.625l-8 10zM15 12h-1V4h-4v8H6.081L12 19.399 17.919 12H15z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                <button className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{content.reddit.comments} Comments</span>
                </button>
                <button className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'facebook':
        return (
          <div ref={previewRef} className="w-full max-w-2xl bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                {content.facebook.profileImage ? (
                  <img
                    src={content.facebook.profileImage}
                    alt={content.facebook.username}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold hover:underline cursor-pointer">
                      {content.facebook.profileName}
                    </span>
                    {content.facebook.verified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{content.facebook.timestamp}</span>
                    <span>•</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 5.524 4.477 10 10 10s10-4.476 10-10c0-5.523-4.477-10-10-10zm0 1.5c4.687 0 8.5 3.813 8.5 8.5 0 4.687-3.813 8.5-8.5 8.5-4.687 0-8.5-3.813-8.5-8.5 0-4.687 3.813-8.5 8.5-8.5z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="mt-3">{content.facebook.postText}</p>
            </div>

            {/* Image */}
            {content.facebook.image && (
              <img
                src={content.facebook.image}
                alt="Post"
                className="w-full"
              />
            )}

            {/* Engagement Stats */}
            <div className="px-4 py-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.045.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.368-3.43-7.788-7.8-7.79zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.334-.75-.75-.75h-.395c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z" />
                      </svg>
                    </span>
                  </div>

                  <span>{content.facebook.likes}</span>

                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 py-2 border-t border-gray-200">
              <div className="flex justify-between">
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z" />
                  </svg>
                  <span className="text-gray-600">Like</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
                  </svg>
                  <span className="text-gray-600">Comment</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                  </svg>
                  <span className="text-gray-600">Share</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'youtube':
        return (
          <div ref={previewRef} className="w-full max-w-3xl bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Video Player Area */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {content.youtube.thumbnailImage ? (
                <img
                  src={content.youtube.thumbnailImage}
                  alt="Video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center cursor-pointer">
                <div className="w-16 h-16 bg-black bg-opacity-60 rounded-full flex items-center justify-center opacity-0 hover:opacity-100">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                {content.youtube.duration || '12:34'}
              </div>
            </div>

            {/* Video Info Section */}
            <div className="p-4">
              <div className="flex gap-4">
                {/* Channel Avatar */}
                <div className="flex-shrink-0">
                  {content.youtube.channelAvatar ? (<>
                    <img
                      src={content.youtube.channelAvatar}
                      alt={content.youtube.channelName}
                      className="w-10 h-10 rounded-full cursor-pointer hover:opacity-90"
                    />
                  </>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 cursor-pointer" />
                  )}
                </div>

                {/* Video Details */}
                <div className="flex-grow">
                  <h1 className="font-semibold text-lg leading-6 mb-1 cursor-pointer hover:underline">
                    {content.youtube.title || 'Video Title Goes Here - Amazing Content'}
                  </h1>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span>{content.youtube.views || '1.2M'} views</span>
                    <span className="mx-1">•</span>
                    <span>{content.youtube.timestamp || '2 months ago'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-sm cursor-pointer hover:text-gray-800">{content.youtube.channelName || 'Channel Name'}</span>
                    {content.youtube.isVerified && (
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    )} <h1 className='text-[13px] text-gray-700'>{content.youtube.subscribers || 34}</h1>
                  </div>
                </div>

                {/* Subscribe Button */}
                <button
                  className="h-9 px-4 bg-red-600 text-white rounded-full font-medium text-sm hover:bg-red-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 border-t pt-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                  </svg>
                  <span>{content.youtube.likes || '125K'}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                  </svg>
                  <span>Dislike</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 5.63L20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z" />
                  </svg>
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z" />
                  </svg>
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'whatsapp':
        return (
          <div ref={previewRef} className="w-full max-w-md bg-[#0a1014] rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-[#1f2c34] px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {content.whatsapp?.profileImage ? (
                  <img
                    src={content.whatsapp.profileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
                <div>
                  <h3 className="text-white font-medium">{content.whatsapp?.username || "Contact Name"}</h3>
                  <span className="text-sm text-gray-400">online</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z" />
                </svg>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z" />
                </svg>
              </div>
            </div>

            {/* Chat Area */}
            <div className="bg-[#0a1014] p-4 space-y-4 min-h-[400px]" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}>
              {/* Received Message */}
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="bg-[#202c33] text-white p-2 rounded-lg">
                  <p className="text-sm">{content.whatsapp?.receivedMessage || "Hey there! How are you?"}</p>
                  <span className="text-[10px] text-gray-400 float-right mt-1">
                    {content.whatsapp?.receivedTime || "11:45 AM"}
                  </span>
                </div>
              </div>

              {/* Sent Message */}
              <div className="flex items-start justify-end gap-2">
                <div className="bg-[#005c4b] text-white p-2 rounded-lg max-w-[80%]">
                  <p className="text-sm">{content.whatsapp?.message || "I'm doing great, thanks!"}</p>
                  {content.whatsapp?.image && (
                    <img
                      src={content.whatsapp.image}
                      alt="Sent"
                      className="mt-2 rounded-lg max-w-full"
                    />
                  )}
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-gray-300">
                      {content.whatsapp?.time || "11:46 AM"}
                    </span>
                    <svg className="w-4 h-4 text-[#53bdeb]" viewBox="0 0 16 15" fill="currentColor">
                      <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-[#202c33] p-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z" />
              </svg>
              <input
                type="text"
                placeholder="Type a message"
                className="flex-1 bg-[#2a3942] text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z" />
              </svg>
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
                {['twitter', 'instagram', 'email', 'reddit', 'discord', 'whatsapp', 'youtube', 'facebook'].map((platform) => (
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


              {content.platform === 'facebook' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Profile Name</label>
                    <input
                      type="text"
                      value={content.facebook.profileName}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          facebook: { ...prev.facebook, profileName: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter profile name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Post Text</label>
                    <textarea
                      value={content.facebook.postText}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          facebook: { ...prev.facebook, postText: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                      placeholder="What's on your mind?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={content.facebook.location}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          facebook: { ...prev.facebook, location: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Add location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Privacy Setting</label>
                    <select
                      value={content.facebook.privacy}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          facebook: { ...prev.facebook, privacy: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Public">Public</option>
                      <option value="Friends">Friends</option>
                      <option value="Only Me">Only Me</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Feeling/Activity</label>
                    <input
                      type="text"
                      value={content.facebook.feeling || ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          facebook: { ...prev.facebook, feeling: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Add feeling/activity"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Post Image</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('facebook', e, 'image')}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Profile Picture</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('facebook', e, 'profileImage')}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={content.facebook.verified}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          facebook: { ...prev.facebook, verified: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <label className="text-sm font-medium">Verified Account</label>
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
              {content.platform === 'youtube' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Channel Name</label>
                    <input
                      type="text"
                      value={content.youtube.channelName}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          youtube: { ...prev.youtube, channelName: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Channel Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Channel Handle</label>
                    <input
                      type="text"
                      value={content.youtube.channelHandle}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          youtube: { ...prev.youtube, channelHandle: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="@channelhandle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Video Title</label>
                    <input
                      type="text"
                      value={content.youtube.title}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          youtube: { ...prev.youtube, title: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Video title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Video Description</label>
                    <textarea
                      value={content.youtube.description}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          youtube: { ...prev.youtube, description: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                      placeholder="Video description..."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Views</label>
                      <input
                        type="text"
                        value={content.youtube.views}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            youtube: { ...prev.youtube, views: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="245K"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Likes</label>
                      <input
                        type="text"
                        value={content.youtube.likes}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            youtube: { ...prev.youtube, likes: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="15K"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Comments</label>
                      <input
                        type="text"
                        value={content.youtube.comments}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            youtube: { ...prev.youtube, comments: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="1.2K"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Upload Time</label>
                      <input
                        type="text"
                        value={content.youtube.timestamp}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            youtube: { ...prev.youtube, timestamp: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="2 weeks ago"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration</label>
                      <input
                        type="text"
                        value={content.youtube.duration}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            youtube: { ...prev.youtube, duration: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="10:15"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Upload Thumbnail</label>
                      <input
                        type="file"
                        onChange={(e) => handleImageUpload('youtube', e, 'thumbnailImage')}
                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/*"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Channel Avatar</label>
                      <input
                        type="file"
                        onChange={(e) => handleImageUpload('youtube', e, 'channelAvatar')}
                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Subscribers</label>
                      <input
                        type="text"
                        value={content.youtube.subscribers}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            youtube: { ...prev.youtube, subscribers: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="1.2M subscribers"
                      />
                    </div>
                    <div className="flex items-center mt-8">
                      <input
                        type="checkbox"
                        checked={content.youtube.isVerified}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            youtube: { ...prev.youtube, isVerified: e.target.checked },
                          }))
                        }
                        className="mr-2"
                      />
                      <label className="text-sm font-medium">Channel Verified</label>
                    </div>
                  </div>
                </>
              )}


              {content.platform === 'whatsapp' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Name</label>
                    <input
                      type="text"
                      value={content.whatsapp.username}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, username: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={content.whatsapp.phoneNumber}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, phoneNumber: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>


                  <div>
                    <label className="block text-sm font-medium mb-2">Recieved Message</label>
                    <input
                      type="text"
                      value={content.whatsapp.receivedMessage}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, receivedMessage: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter recieved message"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      value={content.whatsapp.message}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, message: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                      placeholder="Type a message..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Time</label>
                      <input
                        type="text"
                        value={content.whatsapp.time}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            whatsapp: { ...prev.whatsapp, time: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="9:45 AM"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message Status</label>
                      <select
                        value={content.whatsapp.status}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            whatsapp: { ...prev.whatsapp, status: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="sent">Sent</option>
                        <option value="delivered">Delivered</option>
                        <option value="read">Read</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Profile Picture</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('whatsapp', e, 'profileImage')}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Message Image</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload('whatsapp', e, 'image')}
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
