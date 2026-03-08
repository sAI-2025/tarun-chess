import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSiteData } from '@/contexts/SiteDataContext';
import { 
  validateAdmin, 
  isAdminLoggedIn, 
  setAdminLoggedIn, 
  generateId,
  getAdminPassword,
  setAdminPassword 
} from '@/lib/siteData';
import type { UpcomingEvent, Program, EventSection } from '@/lib/siteData';
import { Trash2, Plus, GripVertical, LogOut, Eye, Save, RotateCcw, Lock } from 'lucide-react';
import { toast } from 'sonner';

// Login Component
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAdmin(email, password)) {
      setAdminLoggedIn(true);
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Change Password Component
function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPassword !== getAdminPassword()) {
      toast.error('Current password is incorrect');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setAdminPassword(newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password changed successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lock className="h-5 w-5" />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline">
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Upcoming Events Editor
function UpcomingEventsEditor() {
  const { siteData, updateSiteData } = useSiteData();
  const [events, setEvents] = useState<UpcomingEvent[]>(siteData.upcomingEvents);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<UpcomingEvent>>({
    title: '', date: '', type: 'Classes', description: ''
  });

  useEffect(() => {
    setEvents(siteData.upcomingEvents);
  }, [siteData.upcomingEvents]);

  const handleAdd = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.type) {
      toast.error('Please fill in all required fields');
      return;
    }
    const event: UpcomingEvent = {
      id: generateId(),
      title: newEvent.title!,
      date: newEvent.date!,
      type: newEvent.type!,
      description: newEvent.description,
    };
    const updated = [...events, event];
    setEvents(updated);
    updateSiteData({ upcomingEvents: updated });
    setNewEvent({ title: '', date: '', type: 'Classes', description: '' });
    toast.success('Event added');
  };

  const handleUpdate = (id: string, data: Partial<UpcomingEvent>) => {
    const updated = events.map((e) => (e.id === id ? { ...e, ...data } : e));
    setEvents(updated);
    updateSiteData({ upcomingEvents: updated });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updated = events.filter((e) => e.id !== id);
      setEvents(updated);
      updateSiteData({ upcomingEvents: updated });
      toast.success('Event deleted');
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= events.length) return;
    const updated = [...events];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setEvents(updated);
    updateSiteData({ upcomingEvents: updated });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Event Title *</Label>
              <Input
                value={newEvent.title || ''}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Spring Group Classes Begin"
              />
            </div>
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                value={newEvent.date || ''}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                placeholder="Mar 15, 2026"
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={newEvent.type || 'Classes'}
                onValueChange={(v) => setNewEvent({ ...newEvent, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Classes">Classes</SelectItem>
                  <SelectItem value="Camp">Camp</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Tournament">Tournament</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" /> Add Event
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {events.map((event, index) => (
          <Card key={event.id}>
            <CardContent className="py-4">
              {editingId === event.id ? (
                <div className="space-y-3">
                  <Input
                    value={event.title}
                    onChange={(e) => handleUpdate(event.id, { title: e.target.value })}
                    placeholder="Title"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      value={event.date}
                      onChange={(e) => handleUpdate(event.id, { date: e.target.value })}
                      placeholder="Date"
                    />
                    <Select
                      value={event.type}
                      onValueChange={(v) => handleUpdate(event.id, { type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Classes">Classes</SelectItem>
                        <SelectItem value="Camp">Camp</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Tournament">Tournament</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button size="sm" onClick={() => setEditingId(null)}>
                    <Save className="h-4 w-4 mr-1" /> Done
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                      <GripVertical className="h-4 w-4 rotate-90" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, 'down')} disabled={index === events.length - 1}>
                      <GripVertical className="h-4 w-4 rotate-90" />
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date} · {event.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingId(event.id)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(event.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Programs Editor
function ProgramsEditor() {
  const { siteData, updateSiteData } = useSiteData();
  const [programs, setPrograms] = useState<Program[]>(siteData.programs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProgram, setNewProgram] = useState<Partial<Program>>({
    title: '', description: '', iconType: 'users'
  });

  useEffect(() => {
    setPrograms(siteData.programs);
  }, [siteData.programs]);

  const handleAdd = () => {
    if (!newProgram.title || !newProgram.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    const program: Program = {
      id: generateId(),
      title: newProgram.title!,
      description: newProgram.description!,
      iconType: newProgram.iconType || 'users',
    };
    const updated = [...programs, program];
    setPrograms(updated);
    updateSiteData({ programs: updated });
    setNewProgram({ title: '', description: '', iconType: 'users' });
    toast.success('Program added');
  };

  const handleUpdate = (id: string, data: Partial<Program>) => {
    const updated = programs.map((p) => (p.id === id ? { ...p, ...data } : p));
    setPrograms(updated);
    updateSiteData({ programs: updated });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      const updated = programs.filter((p) => p.id !== id);
      setPrograms(updated);
      updateSiteData({ programs: updated });
      toast.success('Program deleted');
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= programs.length) return;
    const updated = [...programs];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setPrograms(updated);
    updateSiteData({ programs: updated });
  };

  const iconOptions = [
    { value: 'users', label: 'Group (Users)' },
    { value: 'user', label: 'Individual (User)' },
    { value: 'monitor', label: 'Online (Monitor)' },
    { value: 'layers', label: 'Levels (Layers)' },
    { value: 'swords', label: 'Competition (Swords)' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Program Title *</Label>
              <Input
                value={newProgram.title || ''}
                onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                placeholder="Group Classes"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon Type</Label>
              <Select
                value={newProgram.iconType || 'users'}
                onValueChange={(v: Program['iconType']) => setNewProgram({ ...newProgram, iconType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={newProgram.description || ''}
              onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
              placeholder="Learn alongside peers in a collaborative environment..."
              rows={3}
            />
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" /> Add Program
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {programs.map((program, index) => (
          <Card key={program.id}>
            <CardContent className="py-4">
              {editingId === program.id ? (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      value={program.title}
                      onChange={(e) => handleUpdate(program.id, { title: e.target.value })}
                      placeholder="Title"
                    />
                    <Select
                      value={program.iconType}
                      onValueChange={(v: Program['iconType']) => handleUpdate(program.id, { iconType: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    value={program.description}
                    onChange={(e) => handleUpdate(program.id, { description: e.target.value })}
                    rows={3}
                  />
                  <Button size="sm" onClick={() => setEditingId(null)}>
                    <Save className="h-4 w-4 mr-1" /> Done
                  </Button>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                      <GripVertical className="h-4 w-4 rotate-90" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, 'down')} disabled={index === programs.length - 1}>
                      <GripVertical className="h-4 w-4 rotate-90" />
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{program.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingId(program.id)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(program.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Event Sections Editor
function EventSectionsEditor() {
  const { siteData, updateSiteData } = useSiteData();
  const [sections, setSections] = useState<EventSection[]>(siteData.eventSections);
  const [pastBootcamp, setPastBootcamp] = useState(siteData.pastBootcamp);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBootcamp, setEditingBootcamp] = useState(false);
  const [newSection, setNewSection] = useState<Partial<EventSection>>({
    title: '', description: '', iconType: 'tent'
  });

  useEffect(() => {
    setSections(siteData.eventSections);
    setPastBootcamp(siteData.pastBootcamp);
  }, [siteData.eventSections, siteData.pastBootcamp]);

  const handleAdd = () => {
    if (!newSection.title || !newSection.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    const section: EventSection = {
      id: generateId(),
      title: newSection.title!,
      description: newSection.description!,
      iconType: newSection.iconType || 'tent',
    };
    const updated = [...sections, section];
    setSections(updated);
    updateSiteData({ eventSections: updated });
    setNewSection({ title: '', description: '', iconType: 'tent' });
    toast.success('Section added');
  };

  const handleUpdate = (id: string, data: Partial<EventSection>) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, ...data } : s));
    setSections(updated);
    updateSiteData({ eventSections: updated });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      const updated = sections.filter((s) => s.id !== id);
      setSections(updated);
      updateSiteData({ eventSections: updated });
      toast.success('Section deleted');
    }
  };

  const handleBootcampUpdate = (data: Partial<typeof pastBootcamp>) => {
    const updated = { ...pastBootcamp, ...data };
    setPastBootcamp(updated);
    updateSiteData({ pastBootcamp: updated });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const updated = [...sections];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setSections(updated);
    updateSiteData({ eventSections: updated });
  };

  const iconOptions = [
    { value: 'tent', label: 'Camp (Tent)' },
    { value: 'trophy', label: 'Tournament (Trophy)' },
    { value: 'lightbulb', label: 'Workshop (Lightbulb)' },
    { value: 'info', label: 'Info' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Event Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Section Title *</Label>
              <Input
                value={newSection.title || ''}
                onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                placeholder="Summer Camps"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon Type</Label>
              <Select
                value={newSection.iconType || 'tent'}
                onValueChange={(v: EventSection['iconType']) => setNewSection({ ...newSection, iconType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={newSection.description || ''}
              onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
              placeholder="Immersive multi-day chess bootcamps..."
              rows={2}
            />
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" /> Add Section
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <Card key={section.id}>
            <CardContent className="py-4">
              {editingId === section.id ? (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      value={section.title}
                      onChange={(e) => handleUpdate(section.id, { title: e.target.value })}
                      placeholder="Title"
                    />
                    <Select
                      value={section.iconType}
                      onValueChange={(v: EventSection['iconType']) => handleUpdate(section.id, { iconType: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    value={section.description}
                    onChange={(e) => handleUpdate(section.id, { description: e.target.value })}
                    rows={2}
                  />
                  <Button size="sm" onClick={() => setEditingId(null)}>
                    <Save className="h-4 w-4 mr-1" /> Done
                  </Button>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                      <GripVertical className="h-4 w-4 rotate-90" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, 'down')} disabled={index === sections.length - 1}>
                      <GripVertical className="h-4 w-4 rotate-90" />
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{section.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{section.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingId(section.id)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(section.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Past Bootcamp Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Past Bootcamp Section</CardTitle>
        </CardHeader>
        <CardContent>
          {editingBootcamp ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={pastBootcamp.title}
                  onChange={(e) => handleBootcampUpdate({ title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Paragraph 1</Label>
                <Textarea
                  value={pastBootcamp.paragraphs[0] || ''}
                  onChange={(e) => handleBootcampUpdate({ 
                    paragraphs: [e.target.value, pastBootcamp.paragraphs[1] || ''] 
                  })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Paragraph 2</Label>
                <Textarea
                  value={pastBootcamp.paragraphs[1] || ''}
                  onChange={(e) => handleBootcampUpdate({ 
                    paragraphs: [pastBootcamp.paragraphs[0] || '', e.target.value] 
                  })}
                  rows={3}
                />
              </div>
              <Button size="sm" onClick={() => setEditingBootcamp(false)}>
                <Save className="h-4 w-4 mr-1" /> Done
              </Button>
            </div>
          ) : (
            <div>
              <p className="font-medium text-foreground mb-2">{pastBootcamp.title}</p>
              {pastBootcamp.paragraphs.map((p, i) => (
                <p key={i} className="text-sm text-muted-foreground mb-2">{p}</p>
              ))}
              <Button variant="outline" size="sm" onClick={() => setEditingBootcamp(true)}>
                Edit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main Admin Panel
function AdminPanel() {
  const navigate = useNavigate();
  const { resetToDefault } = useSiteData();

  const handleLogout = () => {
    setAdminLoggedIn(false);
    navigate('/');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
      resetToDefault();
      toast.success('All content reset to defaults');
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="font-display text-xl font-bold text-primary">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <a href="/" target="_blank">
                <Eye className="h-4 w-4 mr-1" /> View Site
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="event-sections">Events Page</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <UpcomingEventsEditor />
          </TabsContent>

          <TabsContent value="programs">
            <ProgramsEditor />
          </TabsContent>

          <TabsContent value="event-sections">
            <EventSectionsEditor />
          </TabsContent>

          <TabsContent value="settings">
            <ChangePasswordSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Main Admin Page
export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAdminLoggedIn());

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AdminPanel />;
}
