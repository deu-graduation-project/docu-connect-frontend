export default function ContactInfo() {
  return (
    <div className="p-4 md:p-8 bg-white shadow rounded">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Contact Information</h2>
      <p className="text-sm md:text-base">For support, please contact us at:</p>
      <ul className="mt-2 space-y-2">
        <li>Email: <a href="mailto:support@example.com" className="text-blue-500">support@example.com</a></li>
        <li>Phone: <a href="tel:+1234567890" className="text-blue-500">+1 234 567 890</a></li>
      </ul>
    </div>
  );
}
