'use client'

import { apiSpec } from '../api-docs'
import { useState } from 'react'

export default function ApiDocs() {
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null)

  const endpoints = Object.entries(apiSpec.paths || {}).map(([path, methods]) => ({
    path,
    methods: Object.entries(methods as Record<string, any> || {})
  }))

  return (
    <div className="min-h-screen bg-[#1C1B1F] text-[#E6E1E5] p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{apiSpec.info?.title || 'API Documentation'}</h1>
        <p className="text-[#CAC4D0] mb-8">{apiSpec.info?.description || ''}</p>

        <div className="space-y-6">
          {endpoints.map(({ path, methods }) => (
            <div 
              key={path} 
              className="bg-[#2B2930] rounded-xl border border-[#48464C]/30 overflow-hidden"
            >
              {methods.map(([method, details]) => (
                <div key={`${path}-${method}`} className="border-b border-[#48464C]/30 last:border-0">
                  <button
                    onClick={() => setActiveEndpoint(activeEndpoint === `${path}-${method}` ? null : `${path}-${method}`)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-[#48464C]/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <span className={`
                        px-2 py-1 rounded-lg text-xs font-medium uppercase
                        ${method === 'get' ? 'bg-blue-500/20 text-blue-400' :
                          method === 'post' ? 'bg-green-500/20 text-green-400' :
                          method === 'put' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'}
                      `}>
                        {method}
                      </span>
                      <span className="font-mono">{path}</span>
                    </div>
                    <span className="text-[#CAC4D0]">{details.summary}</span>
                  </button>

                  {activeEndpoint === `${path}-${method}` && (
                    <div className="px-6 py-4 border-t border-[#48464C]/30 bg-[#1C1B1F]/30">
                      <p className="text-[#CAC4D0] mb-4">{details.description}</p>
                      
                      {details.requestBody && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Request Body:</h3>
                          <pre className="bg-[#1C1B1F] p-4 rounded-lg overflow-x-auto">
                            {JSON.stringify(details.requestBody.content['application/json'].schema, null, 2)}
                          </pre>
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm font-medium mb-2">Responses:</h3>
                        {Object.entries(details.responses || {}).map(([code, response]: [string, any]) => (
                          <div key={code} className="mb-4">
                            <h4 className="text-sm font-mono mb-2">
                              Status: <span className={code.startsWith('2') ? 'text-green-400' : 'text-red-400'}>{code}</span>
                            </h4>
                            <pre className="bg-[#1C1B1F] p-4 rounded-lg overflow-x-auto">
                              {JSON.stringify(response.content?.['application/json']?.schema || response, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 