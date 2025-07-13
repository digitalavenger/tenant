import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Eye, Edit, Plus } from 'lucide-react';
import { WhatsAppTemplate } from '../../types';
import { whatsappService } from '../../services/whatsapp';

interface MessageTemplatesProps {
  communityId: string;
}

export default function MessageTemplates({ communityId }: MessageTemplatesProps) {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const [previewData, setPreviewData] = useState({
    tenantName: 'John Doe',
    flatNumber: 'A-101',
    communityName: 'Green Valley Apartments',
    amount: '3000',
    dueDate: '31st March 2024',
    paymentLink: 'https://pay.example.com/abc123',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const fetchedTemplates = await whatsappService.fetchTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTemplatePreview = (template: WhatsAppTemplate) => {
    if (!template) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-sm">
        <div className="bg-green-500 text-white p-2 rounded-t-lg text-sm font-medium">
          WhatsApp Business
        </div>
        <div className="p-3 space-y-2">
          {template.components.map((component, index) => {
            let content = component.text || '';
            
            // Replace placeholders with preview data
            content = content
              .replace(/\{\{1\}\}/g, previewData.tenantName)
              .replace(/\{\{2\}\}/g, previewData.flatNumber)
              .replace(/\{\{3\}\}/g, previewData.communityName)
              .replace(/\{\{4\}\}/g, `₹${previewData.amount}`)
              .replace(/\{\{5\}\}/g, previewData.dueDate);

            return (
              <div key={index}>
                {component.type === 'HEADER' && (
                  <div className="font-bold text-gray-900 text-sm">{content}</div>
                )}
                {component.type === 'BODY' && (
                  <div className="text-gray-800 text-sm whitespace-pre-line">{content}</div>
                )}
                {component.type === 'FOOTER' && (
                  <div className="text-gray-500 text-xs">{content}</div>
                )}
                {component.type === 'BUTTONS' && component.buttons && (
                  <div className="space-y-1 mt-2">
                    {component.buttons.map((button, btnIndex) => (
                      <button
                        key={btnIndex}
                        className="w-full bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600"
                      >
                        {button.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MessageSquare className="h-6 w-6 text-primary mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Message Templates</h3>
        </div>
        <button className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates List */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Available Templates</h4>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading templates...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'border-secondary bg-secondary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">{template.name}</h5>
                      <p className="text-sm text-gray-500">
                        Language: {template.language} | Status: {template.status}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      template.status === 'APPROVED' 
                        ? 'bg-green-100 text-green-800' 
                        : template.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {template.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Template Preview */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Template Preview</h4>
          
          {/* Preview Data Form */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Preview Data</h5>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Tenant Name"
                value={previewData.tenantName}
                onChange={(e) => setPreviewData({ ...previewData, tenantName: e.target.value })}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Flat Number"
                value={previewData.flatNumber}
                onChange={(e) => setPreviewData({ ...previewData, flatNumber: e.target.value })}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Community Name"
                value={previewData.communityName}
                onChange={(e) => setPreviewData({ ...previewData, communityName: e.target.value })}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Amount"
                value={previewData.amount}
                onChange={(e) => setPreviewData({ ...previewData, amount: e.target.value })}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Due Date"
                value={previewData.dueDate}
                onChange={(e) => setPreviewData({ ...previewData, dueDate: e.target.value })}
                className="px-2 py-1 text-sm border border-gray-300 rounded col-span-2"
              />
            </div>
          </div>

          {/* Template Preview */}
          {selectedTemplate ? (
            <div className="space-y-4">
              {renderTemplatePreview(selectedTemplate)}
              
              <div className="flex space-x-3">
                <button className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 flex items-center justify-center">
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Message
                </button>
                <button className="flex-1 bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 flex items-center justify-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Template
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Select a template to preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Template Usage Guidelines */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Template Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Templates must be approved by WhatsApp before use</li>
          <li>Use placeholders like {`{{1}}, {{2}}`} for dynamic content</li>
          <li>Keep messages concise and relevant</li>
          <li>Include clear call-to-action buttons</li>
          <li>Test templates before sending to tenants</li>
        </ul>
      </div>
    </div>
  );
}