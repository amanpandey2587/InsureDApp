import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Send, Mail, Phone } from 'lucide-react';
import emailjs from 'emailjs-com';
import { toast } from 'react-hot-toast';

type FormData = {
  name: string;
  email: string;
  message: string;
};

const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      toast.loading('Sending email...', {
        id: 'sending',
        position: 'top-center',
      });

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const userId = import.meta.env.VITE_EMAILJS_USER_ID;

      console.log(serviceId, templateId, userId);

      const result = await emailjs.send(serviceId, templateId, data, userId);
      console.log('Result is', result);

      toast.success('Email sent successfully!', {
        id: 'sending',
        position: 'top-center',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send the message. Please try again.', {
        id: 'sending',
        position: 'top-center',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-50 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-6">
          Contact Us
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.name ? 'border-red-500' : 'border-blue-200'
                  }`}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.email ? 'border-red-500' : 'border-blue-200'
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  className={`w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.message ? 'border-red-500' : 'border-blue-200'
                  }`}
                  {...register('message', { required: 'Message is required' })}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                disabled={isSubmitting}
              >
                <Send className="mr-2" size={20} />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              Get In Touch
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="mr-3 text-blue-600" />
                <span>support@insuredapp.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3 text-blue-600" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
