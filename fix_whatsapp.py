import os
import glob
import re

WHATSAPP_PHONE = "256742644200"

def replace_forms():
    files = glob.glob('src/components/**/*.tsx', recursive=True)
    
    # 1. AboutAndContactSection
    about_file = 'src/components/AboutAndContactSection.tsx'
    with open(about_file, 'r') as f:
        content = f.read()
    
    # Replace the handleSubmit logic inside AboutAndContactSection
    new_about_submit = """
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Format WhatsApp message
    const message = `*NEW WEBSITE INQUIRY*
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Interest: ${formData.interest}

*Message:*
${formData.message}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/256742644200?text=${encodedMessage}`;
    
    // Open WhatsApp immediately
    window.open(whatsappUrl, '_blank');
    
    playChimeSound();
    setSubmitSuccess(true);
    setIsSubmitting(false);
    
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({ name: "", phone: "", email: "", interest: "General Inquiry", message: "" });
    }, 5000);
  };
"""
    # Use regex to replace the old handleSubmit
    content = re.sub(r'const handleSubmit = async \(e: React\.FormEvent\) => \{.*?\n  \};\n', new_about_submit.strip() + '\n', content, flags=re.DOTALL)
    
    with open(about_file, 'w') as f:
        f.write(content)

    # 2. BookSurveyModal
    survey_file = 'src/components/BookSurveyModal.tsx'
    with open(survey_file, 'r') as f:
        content = f.read()

    new_survey_submit = """
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Format WhatsApp message
    const message = `*NEW SITE SURVEY BOOKING*
Name: ${formData.name}
Phone: ${formData.phone}
Location: ${formData.location}

*Project Details:*
${formData.projectDetails}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/256742644200?text=${encodedMessage}`;
    
    // Open WhatsApp immediately
    window.open(whatsappUrl, '_blank');
    
    playChimeSound();
    setSubmitSuccess(true);
    setIsSubmitting(false);
    
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({ name: "", phone: "", location: "", projectDetails: "" });
      onClose();
    }, 3000);
  };
"""
    content = re.sub(r'const handleSubmit = async \(e: React\.FormEvent\) => \{.*?\n  \};\n', new_survey_submit.strip() + '\n', content, flags=re.DOTALL)
    with open(survey_file, 'w') as f:
        f.write(content)

    # 3. QuoteDrawer
    quote_file = 'src/components/QuoteDrawer.tsx'
    with open(quote_file, 'r') as f:
        content = f.read()

    new_quote_submit = """
  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Build cart items summary
    const cartSummary = cart.map(item => `- ${item.quantity}x ${item.product.name} (UGX ${item.product.priceUGX.toLocaleString()})`).join('\\n');
    
    // Format WhatsApp message
    let message = `*NEW QUOTE REQUEST*
Name: ${formData.clientName}
Phone: ${formData.phone}
Email: ${formData.email || 'N/A'}
Location: ${formData.location}`;

    if (customEstimate) {
      message += `\\n\\n*Custom Site Project:*
Type: ${customEstimate.type}
Estimated UGX: ${customEstimate.estimatedTotalUGX.toLocaleString()}
Description: ${customEstimate.description}`;
    }

    if (cart.length > 0) {
      message += `\\n\\n*Furniture Cart Items:*\\n${cartSummary}\\nTotal Cart Value: UGX ${cartTotal.toLocaleString()}`;
    }
    
    if (formData.details) {
      message += `\\n\\n*Additional Details:*\\n${formData.details}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/256742644200?text=${encodedMessage}`;
    
    // Open WhatsApp immediately
    window.open(whatsappUrl, '_blank');
    
    playChimeSound();
    setSubmitSuccess(true);
    setIsSubmitting(false);
    
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({ clientName: "", phone: "", email: "", location: "", details: "" });
      if (onClearCart) onClearCart();
      if (onClearCustomEstimate) onClearCustomEstimate();
      onClose();
    }, 3000);
  };
"""
    content = re.sub(r'const handleSubmitQuote = async \(e: React\.FormEvent\) => \{.*?\n  \};\n', new_quote_submit.strip() + '\n', content, flags=re.DOTALL)
    with open(quote_file, 'w') as f:
        f.write(content)

replace_forms()
print("Forms updated to use WhatsApp!")
