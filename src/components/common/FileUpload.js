import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { formatFileSize } from '../../utils/formatters';

const FileUpload = ({
  onFileSelect,
  accept = 'image/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 10,
  className = '',
  children
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const handleFiles = (files) => {
    setError('');
    const fileArray = Array.from(files);

    if (multiple && fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = [];
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setError(error);
        return;
      }
      validFiles.push(file);
    }

    onFileSelect(multiple ? validFiles : validFiles[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      
      <div
        className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-primary bg-primary bg-opacity-10' 
            : 'border-secondary hover:border-primary'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        style={{ cursor: 'pointer' }}
      >
        {children || (
          <>
            <i className="fa fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
            <p className="mb-2">
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="text-muted small">
              {accept.includes('image') ? 'Images' : 'Files'} up to {formatFileSize(maxSize)}
              {multiple && ` (max ${maxFiles} files)`}
            </p>
          </>
        )}
      </div>
      
      {error && (
        <div className="alert alert-danger mt-2 mb-0">
          <small>{error}</small>
        </div>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  maxSize: PropTypes.number,
  maxFiles: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node
};

FileUpload.defaultProps = {
  accept: 'image/*',
  multiple: false,
  maxSize: 5 * 1024 * 1024,
  maxFiles: 10,
  className: '',
  children: null
};

export default FileUpload;
