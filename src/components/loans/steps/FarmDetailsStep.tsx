
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

interface FarmDetailsStepProps {
  onComplete: (data: any) => void;
  initialData?: any;
}

const FarmDetailsStep: React.FC<FarmDetailsStepProps> = ({ onComplete, initialData = {} }) => {
  const [formData, setFormData] = useState({
    farmName: initialData.farmName || '',
    farmLocation: initialData.farmLocation || '',
    farmSize: initialData.farmSize || '',
    sizeUnit: initialData.sizeUnit || 'acres',
    farmType: initialData.farmType || '',
    cropTypes: initialData.cropTypes || '',
    farmDescription: initialData.farmDescription || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.farmName.trim()) {
      newErrors.farmName = 'Farm name is required';
    }
    
    if (!formData.farmLocation.trim()) {
      newErrors.farmLocation = 'Farm location is required';
    }
    
    if (!formData.farmSize.trim()) {
      newErrors.farmSize = 'Farm size is required';
    } else if (isNaN(parseFloat(formData.farmSize))) {
      newErrors.farmSize = 'Farm size must be a number';
    }
    
    if (!formData.farmType.trim()) {
      newErrors.farmType = 'Farm type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete({ farmDetails: formData });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="farmName">Farm Name <span className="text-red-500">*</span></Label>
          <Input
            id="farmName"
            name="farmName"
            value={formData.farmName}
            onChange={handleChange}
            placeholder="Enter your farm name"
            className={errors.farmName ? "border-red-500" : ""}
          />
          {errors.farmName && <p className="text-sm text-red-500">{errors.farmName}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="farmLocation">Farm Location <span className="text-red-500">*</span></Label>
          <Input
            id="farmLocation"
            name="farmLocation"
            value={formData.farmLocation}
            onChange={handleChange}
            placeholder="Village, District, State"
            className={errors.farmLocation ? "border-red-500" : ""}
          />
          {errors.farmLocation && <p className="text-sm text-red-500">{errors.farmLocation}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="farmSize">Farm Size <span className="text-red-500">*</span></Label>
          <Input
            id="farmSize"
            name="farmSize"
            type="number"
            value={formData.farmSize}
            onChange={handleChange}
            placeholder="Size"
            className={errors.farmSize ? "border-red-500" : ""}
          />
          {errors.farmSize && <p className="text-sm text-red-500">{errors.farmSize}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sizeUnit">Unit</Label>
          <Select
            value={formData.sizeUnit}
            onValueChange={(value) => handleSelectChange('sizeUnit', value)}
          >
            <SelectTrigger id="sizeUnit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acres">Acres</SelectItem>
              <SelectItem value="hectares">Hectares</SelectItem>
              <SelectItem value="bigha">Bigha</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="farmType">Farm Type <span className="text-red-500">*</span></Label>
          <Select
            value={formData.farmType}
            onValueChange={(value) => handleSelectChange('farmType', value)}
          >
            <SelectTrigger id="farmType" className={errors.farmType ? "border-red-500" : ""}>
              <SelectValue placeholder="Select farm type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="crop">Crop Farm</SelectItem>
              <SelectItem value="dairy">Dairy Farm</SelectItem>
              <SelectItem value="poultry">Poultry Farm</SelectItem>
              <SelectItem value="mixed">Mixed Farm</SelectItem>
              <SelectItem value="horticulture">Horticulture</SelectItem>
            </SelectContent>
          </Select>
          {errors.farmType && <p className="text-sm text-red-500">{errors.farmType}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cropTypes">Main Crops/Products</Label>
        <Input
          id="cropTypes"
          name="cropTypes"
          value={formData.cropTypes}
          onChange={handleChange}
          placeholder="E.g., Rice, Wheat, Milk, Vegetables"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="farmDescription">Brief Description</Label>
        <Textarea
          id="farmDescription"
          name="farmDescription"
          value={formData.farmDescription}
          onChange={handleChange}
          placeholder="Tell us more about your farm..."
          rows={3}
        />
      </div>
      
      <div className="flex justify-end mt-6">
        <Button type="submit" className="flex items-center">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default FarmDetailsStep;
