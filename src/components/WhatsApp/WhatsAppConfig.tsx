import React, { useState, useEffect } from 'react';
import { Save, TestTube, MessageSquare, Settings } from 'lucide-react';
import { whatsappService } from '../../services/whatsapp';
import { WhatsAppTemplate } from '../../types';

interface WhatsAppConfigProps {
  communityId: string;
  initialConfig?: {
    wabaNumber: string;
    apiKey: string;
    baseUrl: string;
  };
  onSave: (config: any) => void;
}

export default function WhatsAppConfig({ communityId, initialConfig, onSave }: WhatsAppConfigProps) {
  const [config, setConfig] = useState({
    wabaNumber: initialConfig?.wabaNumber || '',
    apiKey: initialConfig?.apiKey || '',
    baseUrl: initialConfig?.baseUrl || 'https://cpaasreseller.notify24x7.com/REST/directApi',
  });
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [testNumber, setTestNumber] = useState('');
  const [testing, setTesting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.wabaNumber && config.apiKey) {
      fetchTemplates();
    }
  }, [config.wabaNumber, config.apiKey]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      whatsappService.setConfig(config);
      const fetchedTemplates = await whatsappService.fetchTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    whatsappService.setConfig(config);
    onSave(config);
  };

  const handleTestMessage = async () => {
    if (!testNumber || !selectedTemplate) {
      alert('Please enter test number and select a template');
      return;
    }

    try {
      setTesting(true);
      whatsappService.setConfig(config);
      
      if (selectedTemplate === 'text') {
        await whatsappService.sendTextMessage(
          testNumber,
          'This is a test message from SocietyPay maintenance management system.'
        );
      } else {
        await whatsappService.sendTemplateMessage(testNumber, selectedTemplate);
      }
      
      alert('Test message sent successfully!');
    } catch (error) {
      console.error('Error sending test message:', error);
      alert('Failed to send test message. Please check your configuration.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <MessageSquare className="h-6 w-6 text-primary mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">WhatsApp Configuration</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WABA Number (with country code)
            </label>
            <input
              type="text"
              value={config.wabaNumber}
              onChange={(e) => setConfig({ ...config, wabaNumber: e.target.value })}
              placeholder="e.g., 919876543210"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your WhatsApp Business Account number with country code
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="Enter your Dovesoft API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base URL
            </label>
            <input
              type="url"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 flex items-center justify-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </button>
        </div>

        {/* Templates and Testing */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Templates
            </label>
            <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
              {loading ? (
                <p className="text-gray-500 text-sm">Loading templates...</p>
              ) : templates.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="text-message"
                      name="template"
                      value="text"
                      checked={selectedTemplate === 'text'}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="text-message" className="text-sm">Simple Text Message</label>
                  </div>
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center">
                      <input
                        type="radio"
                        id={template.name}
                        name="template"
                        value={template.name}
                        checked={selectedTemplate === template.name}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor={template.name} className="text-sm">
                        {template.name} ({template.status})
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No templates found. Please check your configuration and try again.
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Phone Number
            </label>
            <input
              type="text"
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              placeholder="e.g., 919876543210"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <button
            onClick={handleTestMessage}
            disabled={testing || !testNumber || !selectedTemplate}
            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <TestTube className="h-4 w-4 mr-2" />
            {testing ? 'Sending...' : 'Send Test Message'}
          </button>
        </div>
      </div>

      {/* Template Preview */}
      {selectedTemplate && selectedTemplate !== 'text' && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Template Preview</h4>
          {templates.find(t => t.name === selectedTemplate)?.components.map((component, index) => (
            <div key={index} className="mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">
                {component.type}:
              </span>
              <p className="text-sm text-gray-700">{component.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Setup Instructions</h4>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Get your WABA number and API key from Dovesoft</li>
          <li>Enter the configuration details above</li>
          <li>Save the configuration</li>
          <li>Test with a sample message to verify setup</li>
          <li>Create message templates in WhatsApp Business Manager</li>
        </ol>
      </div>
    </div>
  );
}