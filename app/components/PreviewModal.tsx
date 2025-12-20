'use client';

import React, { useState, useEffect, useRef } from 'react';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

interface FileResource {
  id: number;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

interface PreviewModalProps {
  file: FileResource | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PreviewModal({ file, isOpen, onClose }: PreviewModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [wordHtml, setWordHtml] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  // 将 base64 转换为二进制数据
  const base64ToUint8Array = (base64: string): Uint8Array => {
    const base64Data = base64.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  };

  // 处理文件预览
  useEffect(() => {
    if (!file || !isOpen) {
      setPdfUrl(null);
      setWordHtml(null);
      setExcelData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const isPdf = file.type.includes('pdf');
    const isWord = file.name.endsWith('.docx') || file.type.includes('word') || file.type.includes('document');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.type.includes('excel') || file.type.includes('spreadsheet');

    try {
      if (isPdf && file.url.startsWith('data:')) {
        // PDF 预览：转换为 Blob URL
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = null;
        }
        const byteArray = base64ToUint8Array(file.url);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setPdfUrl(url);
        setLoading(false);
      } else if (isPdf) {
        setPdfUrl(file.url);
        setLoading(false);
      } else if (isWord && file.name.endsWith('.docx') && file.url.startsWith('data:')) {
        // Word 预览：转换为 HTML
        const byteArray = base64ToUint8Array(file.url);
        mammoth.convertToHtml({ arrayBuffer: byteArray.buffer })
          .then((result) => {
            setWordHtml(result.value);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Word 转换失败:', err);
            setError('无法预览 Word 文档，请下载后查看');
            setLoading(false);
          });
      } else if (isExcel && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) && file.url.startsWith('data:')) {
        // Excel 预览：读取并转换为表格数据
        const byteArray = base64ToUint8Array(file.url);
        try {
          const workbook = XLSX.read(byteArray, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
          setExcelData(jsonData as any[][]);
          setLoading(false);
        } catch (err) {
          console.error('Excel 读取失败:', err);
          setError('无法预览 Excel 文件，请下载后查看');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('文件处理失败:', err);
      setError('文件处理失败');
      setLoading(false);
    }

    // 清理函数
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [file, isOpen]);

  // 处理键盘事件（ESC 关闭）
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !file) return null;

  const isImage = file.type.startsWith('image/');
  const isPdf = file.type.includes('pdf');
  const isWord = file.name.endsWith('.docx') || file.type.includes('word') || file.type.includes('document');
  const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.type.includes('excel') || file.type.includes('spreadsheet');
  const isOldWord = file.name.endsWith('.doc') && !file.name.endsWith('.docx');
  const isOldExcel = file.name.endsWith('.xls') && !file.name.endsWith('.xlsx');
  const isOffice = isWord || isExcel || isOldWord || isOldExcel;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{file.name}</h3>
            <p className="text-sm text-gray-500">{file.type}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              下载
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="关闭"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">正在加载文件...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                下载文件
              </button>
            </div>
          )}

          {!loading && !error && isImage && (
            <div className="flex items-center justify-center h-full">
              <img
                src={file.url}
                alt={file.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {!loading && !error && isPdf && (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0"
                  style={{ minHeight: '70vh' }}
                  title={file.name}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-600">正在加载 PDF...</p>
                </div>
              )}
            </div>
          )}

          {!loading && !error && isWord && wordHtml && (
            <div className="w-full h-full bg-white rounded-lg p-8">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: wordHtml }}
                style={{
                  fontFamily: 'Times New Roman, serif',
                  lineHeight: '1.6',
                }}
              />
            </div>
          )}

          {!loading && !error && isExcel && excelData && (
            <div className="w-full h-full bg-white rounded-lg overflow-auto">
              <table className="min-w-full border border-gray-300">
                <tbody>
                  {excelData.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-100 font-semibold' : ''}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-2 border border-gray-300 text-left"
                        >
                          {cell || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (isOldWord || isOldExcel || (!isImage && !isPdf && !isWord && !isExcel)) && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">
                {isOldWord ? '📝' :
                 isOldExcel ? '📊' : '📎'}
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{file.name}</h4>
              <p className="text-gray-600 mb-4">
                {isOldWord ? '旧版 Word 格式 (.doc) 不支持预览' :
                 isOldExcel ? '旧版 Excel 格式 (.xls) 预览可能不完整' :
                 file.type || '未知文件类型'}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                上传时间: {new Date(file.uploadedAt).toLocaleString('zh-CN')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  下载文件
                </button>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  在新标签页打开
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

