'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AssessmentFormData, ChainType } from '@/app/types/assessment';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Select } from '@/app/components/ui/select';

const assessmentSchema = z.object({
  chainName: z.string().min(1, 'Chain name is required'),
  chainType: z.enum(['EVM', 'Cosmos', 'Custom', 'Bitcoin', 'Solana', 'Other']),
  frameworkDetails: z.string().min(1, 'Framework details are required'),
  sdkAvailability: z.string().min(1, 'SDK availability is required'),
  documentationQuality: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'Unknown']),
  nodeRpcStatus: z.enum(['Stable', 'Unstable', 'Unknown']),
  signingAlgorithm: z.string().min(1, 'Signing algorithm is required'),
  tokenStandards: z.array(z.string()).min(1, 'At least one token standard is required'),
  rawQuestionnaireData: z.string().min(1, 'Raw questionnaire data is required'),
  documentationLinks: z.array(z.string()).min(1, 'At least one documentation link is required'),
  additionalNotes: z.string().optional(),
  // Chain metadata
  rpcUrl: z.string().url('Valid RPC URL is required'),
  ticker: z.string().min(1, 'Ticker symbol is required'),
  iconUrl: z.string().url().optional().or(z.literal('')),
  chainId: z.string().optional(),
  explorerUrl: z.string().url().optional().or(z.literal('')),
  githubRepo: z.string().url().optional().or(z.literal('')),
});

interface AssessmentFormProps {
  onSubmit: (data: AssessmentFormData) => void;
  isLoading: boolean;
}

export function AssessmentForm({ onSubmit, isLoading }: AssessmentFormProps) {
  const [tokenStandards, setTokenStandards] = useState<string[]>(['']);
  const [documentationLinks, setDocumentationLinks] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
  });

  const addTokenStandard = () => {
    setTokenStandards([...tokenStandards, '']);
  };

  const removeTokenStandard = (index: number) => {
    setTokenStandards(tokenStandards.filter((_, i) => i !== index));
  };

  const updateTokenStandard = (index: number, value: string) => {
    const updated = [...tokenStandards];
    updated[index] = value;
    setTokenStandards(updated);
    setValue('tokenStandards', updated.filter(s => s.trim() !== ''));
  };

  const addDocumentationLink = () => {
    setDocumentationLinks([...documentationLinks, '']);
  };

  const removeDocumentationLink = (index: number) => {
    setDocumentationLinks(documentationLinks.filter((_, i) => i !== index));
  };

  const updateDocumentationLink = (index: number, value: string) => {
    const updated = [...documentationLinks];
    updated[index] = value;
    setDocumentationLinks(updated);
    setValue('documentationLinks', updated.filter(l => l.trim() !== ''));
  };

  const handleFormSubmit = (data: AssessmentFormData) => {
    onSubmit({
      ...data,
      tokenStandards: tokenStandards.filter(s => s.trim() !== ''),
      documentationLinks: documentationLinks.filter(l => l.trim() !== ''),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="chainName">Chain Name *</Label>
          <Input
            id="chainName"
            {...register('chainName')}
            placeholder="e.g., Ethereum, Bitcoin, Cosmos Hub"
            className={errors.chainName ? 'border-ledger-red' : ''}
          />
          {errors.chainName && (
            <p className="text-sm text-ledger-red">{errors.chainName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="chainType">Chain Type *</Label>
          <Select
            id="chainType"
            {...register('chainType')}
            className={errors.chainType ? 'border-ledger-red' : ''}
          >
            <option value="">Select chain type</option>
            <option value="EVM">EVM</option>
            <option value="Cosmos">Cosmos</option>
            <option value="Custom">Custom</option>
            <option value="Bitcoin">Bitcoin</option>
            <option value="Solana">Solana</option>
            <option value="Other">Other</option>
          </Select>
          {errors.chainType && (
            <p className="text-sm text-ledger-red">{errors.chainType.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="frameworkDetails">Framework Details *</Label>
        <Textarea
          id="frameworkDetails"
          {...register('frameworkDetails')}
          placeholder="Describe the blockchain framework, consensus mechanism, and key technical details"
          rows={3}
          className={errors.frameworkDetails ? 'border-ledger-red' : ''}
        />
        {errors.frameworkDetails && (
          <p className="text-sm text-ledger-red">{errors.frameworkDetails.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="sdkAvailability">SDK Availability *</Label>
          <Textarea
            id="sdkAvailability"
            {...register('sdkAvailability')}
            placeholder="List available SDKs, libraries, and development tools"
            rows={3}
            className={errors.sdkAvailability ? 'border-ledger-red' : ''}
          />
          {errors.sdkAvailability && (
            <p className="text-sm text-ledger-red">{errors.sdkAvailability.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signingAlgorithm">Signing Algorithm *</Label>
          <Input
            id="signingAlgorithm"
            {...register('signingAlgorithm')}
            placeholder="e.g., ECDSA, Ed25519, BLS"
            className={errors.signingAlgorithm ? 'border-ledger-red' : ''}
          />
          {errors.signingAlgorithm && (
            <p className="text-sm text-ledger-red">{errors.signingAlgorithm.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="documentationQuality">Documentation Quality *</Label>
          <Select
            id="documentationQuality"
            {...register('documentationQuality')}
            className={errors.documentationQuality ? 'border-ledger-red' : ''}
          >
            <option value="">Select quality</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Unknown">Unknown</option>
          </Select>
          {errors.documentationQuality && (
            <p className="text-sm text-ledger-red">{errors.documentationQuality.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nodeRpcStatus">Node/RPC Status *</Label>
          <Select
            id="nodeRpcStatus"
            {...register('nodeRpcStatus')}
            className={errors.nodeRpcStatus ? 'border-ledger-red' : ''}
          >
            <option value="">Select status</option>
            <option value="Stable">Stable</option>
            <option value="Unstable">Unstable</option>
            <option value="Unknown">Unknown</option>
          </Select>
          {errors.nodeRpcStatus && (
            <p className="text-sm text-ledger-red">{errors.nodeRpcStatus.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Token Standards *</Label>
        {tokenStandards.map((standard, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={standard}
              onChange={(e) => updateTokenStandard(index, e.target.value)}
              placeholder="e.g., ERC-20, ERC-721, BEP-20"
              className="flex-1"
            />
            {tokenStandards.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeTokenStandard(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTokenStandard}
        >
          Add Token Standard
        </Button>
        {errors.tokenStandards && (
          <p className="text-sm text-ledger-red">{errors.tokenStandards.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Documentation Links *</Label>
        {documentationLinks.map((link, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={link}
              onChange={(e) => updateDocumentationLink(index, e.target.value)}
              placeholder="https://docs.example.com"
              type="url"
              className="flex-1"
            />
            {documentationLinks.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeDocumentationLink(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDocumentationLink}
        >
          Add Documentation Link
        </Button>
        {errors.documentationLinks && (
          <p className="text-sm text-ledger-red">{errors.documentationLinks.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rawQuestionnaireData">Raw Questionnaire Data *</Label>
        <Textarea
          id="rawQuestionnaireData"
          {...register('rawQuestionnaireData')}
          placeholder="Paste the complete questionnaire data here"
          rows={6}
          className={errors.rawQuestionnaireData ? 'border-ledger-red' : ''}
        />
        {errors.rawQuestionnaireData && (
          <p className="text-sm text-ledger-red">{errors.rawQuestionnaireData.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          {...register('additionalNotes')}
          placeholder="Any additional information or context"
          rows={3}
        />
      </div>

      {/* Chain Metadata Section */}
      <div className="border-t border-ledger-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-ledger-black mb-4">Chain Integration Metadata</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="rpcUrl">RPC URL *</Label>
            <Input
              id="rpcUrl"
              {...register('rpcUrl')}
              placeholder="https://mainnet.infura.io/v3/your-key"
              className={errors.rpcUrl ? 'border-ledger-red' : ''}
            />
            {errors.rpcUrl && (
              <p className="text-sm text-ledger-red">{errors.rpcUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticker">Ticker Symbol *</Label>
            <Input
              id="ticker"
              {...register('ticker')}
              placeholder="ETH, BTC, ATOM, etc."
              className={errors.ticker ? 'border-ledger-red' : ''}
            />
            {errors.ticker && (
              <p className="text-sm text-ledger-red">{errors.ticker.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="chainId">Chain ID</Label>
            <Input
              id="chainId"
              {...register('chainId')}
              placeholder="1, 137, 42161, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="explorerUrl">Block Explorer URL</Label>
            <Input
              id="explorerUrl"
              {...register('explorerUrl')}
              placeholder="https://etherscan.io"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="iconUrl">Chain Icon URL</Label>
            <Input
              id="iconUrl"
              {...register('iconUrl')}
              placeholder="https://example.com/icon.png"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubRepo">GitHub Repository</Label>
            <Input
              id="githubRepo"
              {...register('githubRepo')}
              placeholder="https://github.com/ethereum/go-ethereum"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Assessing...' : 'Start Assessment'}
      </Button>
    </form>
  );
}
