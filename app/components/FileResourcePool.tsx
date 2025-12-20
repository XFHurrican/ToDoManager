'use client';

import React, { useState } from 'react';
import PreviewModal from './PreviewModal';

interface FileResource {
  id: number;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

interface FileResourcePoolProps {
  fileResources: FileResource[];
  onAddFile: (file: File) => void;
  onDeleteFile: (fileId: number) => void;
}

export default function FileResourcePool({
  fileResources,
  onAddFile,
  onDeleteFile,
}: FileResourcePoolProps) {
  const [previewFile, setPreviewFile] = useState<FileResource | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('en', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (type: string): string => {
    if (type.includes('word') || type.includes('document')) {
      return '📝';
    } else if (type.includes('excel') || type.includes('spreadsheet')) {
      return '📊';
    } else if (type.includes('pdf')) {
      return '📄';
    } else if (type.includes('image')) {
      return '🖼️';
    } else {
      return '📎';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => onAddFile(file));
    }
  };

  const handlePreview = (file: FileResource) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewFile(null);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Resource Pool</h2>
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
            >
              Upload Files
            </label>
          </div>
        </div>

      {fileResources.length === 0 ? (
        <div className="p-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-500">No file resources yet. Click the button above to upload files.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Filename
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Upload Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fileResources.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                    <div className="text-xs text-gray-500">{file.type}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(file.uploadedAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(file)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        预览
                      </button>
                      <button
                        onClick={() => onDeleteFile(file.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 预览模态框 */}
      <PreviewModal
        file={previewFile}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
    </div>
  );
}
