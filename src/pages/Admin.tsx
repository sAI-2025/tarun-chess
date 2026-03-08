import { useState, useEffect, useRef, DragEvent } from 'react';
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
  setAdminPassword,
  getAdminEmail,
  setAdminEmail
} from '@/lib/siteData';
import type { UpcomingEvent, Program, EventSection } from '@/lib/siteData';
import { Trash2, Plus, GripVertical, LogOut, Eye, Save, RotateCcw, Lock, Pencil, Calendar, BookOpen, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';

// ─── Drag-and-drop hook ─────────────────────────────────────────────
function useDragReorder<T>(items: T[], onReorder: (items: T[]) => void) {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (index: number) => (e: DragEvent) => {
    dragItem.current = index;
    setDraggingIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index: number) => () => {
    dragOverItem.current = index;
    setDragOverIdx(index);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) {
      setDraggingIdx(null);
      setDragOverIdx(null);
      return;
    }
    const updated = [...items];
    const [removed] = updated.splice(dragItem.current, 1);
    updated.splice(dragOverItem.current, 0, removed);
    onReorder(updated);
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggingIdx(null);
    setDragOverIdx(null);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return { draggingIdx, dragOverIdx, handleDragStart, handleDragEnter, handleDragOver, handleDrop, handleDragEnd };
}

// ─── Login ───────────────────────────────────────────────────────────
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your site content</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full h-11 text-base font-semibold">Sign In</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Change Credentials ──────────────────────────────────────────────
function ChangeCredentialsSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newLoginId, setNewLoginId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword !== getAdminPassword()) { toast.error('Current password is incorrect'); return; }
    
    let changed = false;

    // Update login ID if provided
    if (newLoginId.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newLoginId.trim())) {
        toast.error('Please enter a valid email for the new Login ID');
        return;
      }
      setAdminEmail(newLoginId.trim());
      changed = true;
    }

    // Update password if provided
    if (newPassword) {
      if (newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
      if (newPassword !== confirmPassword) { toast.error('New passwords do not match'); return; }
      setAdminPassword(newPassword);
      changed = true;
    }

    if (!changed) { toast.error('Please enter a new Login ID or new password'); return; }

    setCurrentPassword(''); setNewLoginId(''); setNewPassword(''); setConfirmPassword('');
    toast.success('Credentials updated successfully');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lock className="h-5 w-5 text-primary" /> Change Credentials
        </CardTitle>
        <p className="text-sm text-muted-foreground">Update your login email and/or password. Current Login ID: <span className="font-medium text-foreground">{getAdminEmail()}</span></p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password *</Label>
            <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newLoginId">New Login ID (Email)</Label>
            <Input id="newLoginId" type="email" value={newLoginId} onChange={(e) => setNewLoginId(e.target.value)} placeholder={getAdminEmail()} />
            <p className="text-xs text-muted-foreground">Leave blank to keep current login email</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" />
          </div>
          <Button type="submit" className="font-semibold">Update Credentials</Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Draggable Card Wrapper ──────────────────────────────────────────
function DraggableCard({
  index, draggingIdx, dragOverIdx, handleDragStart, handleDragEnter, handleDragOver, handleDrop, handleDragEnd, children
}: {
  index: number; draggingIdx: number | null; dragOverIdx: number | null;
  handleDragStart: (i: number) => (e: DragEvent) => void;
  handleDragEnter: (i: number) => () => void;
  handleDragOver: (e: DragEvent) => void;
  handleDrop: () => void; handleDragEnd: () => void;
  children: React.ReactNode;
}) {
  const isDragging = draggingIdx === index;
  const isOver = dragOverIdx === index && draggingIdx !== index;

  return (
    <div
      draggable
      onDragStart={handleDragStart(index)}
      onDragEnter={handleDragEnter(index)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`transition-all duration-200 rounded-lg ${isDragging ? 'opacity-40 scale-[0.98]' : ''} ${isOver ? 'ring-2 ring-primary/50 ring-offset-2' : ''}`}
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="py-4">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Upcoming Events Editor ──────────────────────────────────────────
function UpcomingEventsEditor() {
  const { siteData, updateSiteData } = useSiteData();
  const [events, setEvents] = useState<UpcomingEvent[]>(siteData.upcomingEvents);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<UpcomingEvent>>({ title: '', date: '', type: 'Classes', description: '' });

  useEffect(() => { setEvents(siteData.upcomingEvents); }, [siteData.upcomingEvents]);

  const save = (updated: UpcomingEvent[]) => { setEvents(updated); updateSiteData({ upcomingEvents: updated }); };

  const handleAdd = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.type) { toast.error('Please fill in all required fields'); return; }
    save([...events, { id: generateId(), title: newEvent.title!, date: newEvent.date!, type: newEvent.type!, description: newEvent.description }]);
    setNewEvent({ title: '', date: '', type: 'Classes', description: '' });
    toast.success('Event added');
  };

  const handleUpdate = (id: string, data: Partial<UpcomingEvent>) => save(events.map((e) => (e.id === id ? { ...e, ...data } : e)));

  const handleDelete = (id: string) => {
    if (confirm('Delete this event?')) { save(events.filter((e) => e.id !== id)); toast.success('Event deleted'); }
  };

  const drag = useDragReorder(events, (reordered) => save(reordered));

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-dashed border-2 border-primary/20 bg-primary/[0.02]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Add New Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Event Title *</Label>
              <Input value={newEvent.title || ''} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Spring Group Classes Begin" />
            </div>
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input value={newEvent.date || ''} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} placeholder="Mar 15, 2026" />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={newEvent.type || 'Classes'} onValueChange={(v) => setNewEvent({ ...newEvent, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
              <Input value={newEvent.description || ''} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="Optional description" />
            </div>
          </div>
          <Button onClick={handleAdd} className="font-semibold"><Plus className="h-4 w-4 mr-1" /> Add Event</Button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground flex items-center gap-1"><GripVertical className="h-3 w-3" /> Drag cards to reorder</p>

      <div className="space-y-3">
        {events.map((event, index) => (
          <DraggableCard key={event.id} index={index} {...drag}>
            {editingId === event.id ? (
              <div className="space-y-3">
                <Input value={event.title} onChange={(e) => handleUpdate(event.id, { title: e.target.value })} placeholder="Title" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={event.date} onChange={(e) => handleUpdate(event.id, { date: e.target.value })} placeholder="Date" />
                  <Select value={event.type} onValueChange={(v) => handleUpdate(event.id, { type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Classes">Classes</SelectItem>
                      <SelectItem value="Camp">Camp</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Tournament">Tournament</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input value={event.description || ''} onChange={(e) => handleUpdate(event.id, { description: e.target.value })} placeholder="Description (optional)" />
                <Button size="sm" onClick={() => setEditingId(null)} className="font-semibold"><Save className="h-4 w-4 mr-1" /> Done</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.date} · {event.type}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(event.id)} className="gap-1.5">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </DraggableCard>
        ))}
      </div>
    </div>
  );
}

// ─── Programs Editor ─────────────────────────────────────────────────
function ProgramsEditor() {
  const { siteData, updateSiteData } = useSiteData();
  const [programs, setPrograms] = useState<Program[]>(siteData.programs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProgram, setNewProgram] = useState<Partial<Program>>({ title: '', description: '', iconType: 'users' });

  useEffect(() => { setPrograms(siteData.programs); }, [siteData.programs]);

  const save = (updated: Program[]) => { setPrograms(updated); updateSiteData({ programs: updated }); };

  const handleAdd = () => {
    if (!newProgram.title || !newProgram.description) { toast.error('Please fill in all required fields'); return; }
    save([...programs, { id: generateId(), title: newProgram.title!, description: newProgram.description!, iconType: newProgram.iconType || 'users' }]);
    setNewProgram({ title: '', description: '', iconType: 'users' });
    toast.success('Program added');
  };

  const handleUpdate = (id: string, data: Partial<Program>) => save(programs.map((p) => (p.id === id ? { ...p, ...data } : p)));

  const handleDelete = (id: string) => {
    if (confirm('Delete this program?')) { save(programs.filter((p) => p.id !== id)); toast.success('Program deleted'); }
  };

  const drag = useDragReorder(programs, (reordered) => save(reordered));

  const iconOptions = [
    { value: 'users', label: 'Group (Users)' },
    { value: 'user', label: 'Individual (User)' },
    { value: 'monitor', label: 'Online (Monitor)' },
    { value: 'layers', label: 'Levels (Layers)' },
    { value: 'swords', label: 'Competition (Swords)' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-dashed border-2 border-primary/20 bg-primary/[0.02]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Add New Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Program Title *</Label>
              <Input value={newProgram.title || ''} onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })} placeholder="Group Classes" />
            </div>
            <div className="space-y-2">
              <Label>Icon Type</Label>
              <Select value={newProgram.iconType || 'users'} onValueChange={(v: Program['iconType']) => setNewProgram({ ...newProgram, iconType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea value={newProgram.description || ''} onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })} placeholder="Learn alongside peers..." rows={3} />
          </div>
          <Button onClick={handleAdd} className="font-semibold"><Plus className="h-4 w-4 mr-1" /> Add Program</Button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground flex items-center gap-1"><GripVertical className="h-3 w-3" /> Drag cards to reorder</p>

      <div className="space-y-3">
        {programs.map((program, index) => (
          <DraggableCard key={program.id} index={index} {...drag}>
            {editingId === program.id ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={program.title} onChange={(e) => handleUpdate(program.id, { title: e.target.value })} placeholder="Title" />
                  <Select value={program.iconType} onValueChange={(v: Program['iconType']) => handleUpdate(program.id, { iconType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea value={program.description} onChange={(e) => handleUpdate(program.id, { description: e.target.value })} rows={3} />
                <Button size="sm" onClick={() => setEditingId(null)} className="font-semibold"><Save className="h-4 w-4 mr-1" /> Done</Button>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 pt-1">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{program.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(program.id)} className="gap-1.5">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(program.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </DraggableCard>
        ))}
      </div>
    </div>
  );
}

// ─── Event Sections Editor ───────────────────────────────────────────
function EventSectionsEditor() {
  const { siteData, updateSiteData } = useSiteData();
  const [sections, setSections] = useState<EventSection[]>(siteData.eventSections);
  const [pastBootcamp, setPastBootcamp] = useState(siteData.pastBootcamp);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBootcamp, setEditingBootcamp] = useState(false);
  const [newSection, setNewSection] = useState<Partial<EventSection>>({ title: '', description: '', iconType: 'tent' });

  useEffect(() => { setSections(siteData.eventSections); setPastBootcamp(siteData.pastBootcamp); }, [siteData.eventSections, siteData.pastBootcamp]);

  const save = (updated: EventSection[]) => { setSections(updated); updateSiteData({ eventSections: updated }); };

  const handleAdd = () => {
    if (!newSection.title || !newSection.description) { toast.error('Please fill in all required fields'); return; }
    save([...sections, { id: generateId(), title: newSection.title!, description: newSection.description!, iconType: newSection.iconType || 'tent' }]);
    setNewSection({ title: '', description: '', iconType: 'tent' });
    toast.success('Section added');
  };

  const handleUpdate = (id: string, data: Partial<EventSection>) => save(sections.map((s) => (s.id === id ? { ...s, ...data } : s)));

  const handleDelete = (id: string) => {
    if (confirm('Delete this section?')) { save(sections.filter((s) => s.id !== id)); toast.success('Section deleted'); }
  };

  const handleBootcampUpdate = (data: Partial<typeof pastBootcamp>) => {
    const updated = { ...pastBootcamp, ...data };
    setPastBootcamp(updated);
    updateSiteData({ pastBootcamp: updated });
  };

  const drag = useDragReorder(sections, (reordered) => save(reordered));

  const iconOptions = [
    { value: 'tent', label: 'Camp (Tent)' },
    { value: 'trophy', label: 'Tournament (Trophy)' },
    { value: 'lightbulb', label: 'Workshop (Lightbulb)' },
    { value: 'info', label: 'Info' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-dashed border-2 border-primary/20 bg-primary/[0.02]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Add New Event Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Section Title *</Label>
              <Input value={newSection.title || ''} onChange={(e) => setNewSection({ ...newSection, title: e.target.value })} placeholder="Summer Camps" />
            </div>
            <div className="space-y-2">
              <Label>Icon Type</Label>
              <Select value={newSection.iconType || 'tent'} onValueChange={(v: EventSection['iconType']) => setNewSection({ ...newSection, iconType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea value={newSection.description || ''} onChange={(e) => setNewSection({ ...newSection, description: e.target.value })} placeholder="Immersive multi-day chess bootcamps..." rows={2} />
          </div>
          <Button onClick={handleAdd} className="font-semibold"><Plus className="h-4 w-4 mr-1" /> Add Section</Button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground flex items-center gap-1"><GripVertical className="h-3 w-3" /> Drag cards to reorder</p>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <DraggableCard key={section.id} index={index} {...drag}>
            {editingId === section.id ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={section.title} onChange={(e) => handleUpdate(section.id, { title: e.target.value })} placeholder="Title" />
                  <Select value={section.iconType} onValueChange={(v: EventSection['iconType']) => handleUpdate(section.id, { iconType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea value={section.description} onChange={(e) => handleUpdate(section.id, { description: e.target.value })} rows={2} />
                <Button size="sm" onClick={() => setEditingId(null)} className="font-semibold"><Save className="h-4 w-4 mr-1" /> Done</Button>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 pt-1">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{section.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{section.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(section.id)} className="gap-1.5">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(section.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </DraggableCard>
        ))}
      </div>

      {/* Past Bootcamp Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Past Bootcamp Section
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editingBootcamp ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={pastBootcamp.title} onChange={(e) => handleBootcampUpdate({ title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Paragraph 1</Label>
                <Textarea value={pastBootcamp.paragraphs[0] || ''} onChange={(e) => handleBootcampUpdate({ paragraphs: [e.target.value, pastBootcamp.paragraphs[1] || ''] })} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Paragraph 2</Label>
                <Textarea value={pastBootcamp.paragraphs[1] || ''} onChange={(e) => handleBootcampUpdate({ paragraphs: [pastBootcamp.paragraphs[0] || '', e.target.value] })} rows={3} />
              </div>
              <Button size="sm" onClick={() => setEditingBootcamp(false)} className="font-semibold"><Save className="h-4 w-4 mr-1" /> Done</Button>
            </div>
          ) : (
            <div>
              <p className="font-medium text-foreground mb-2">{pastBootcamp.title}</p>
              {pastBootcamp.paragraphs.map((p, i) => (
                <p key={i} className="text-sm text-muted-foreground mb-2">{p}</p>
              ))}
              <Button variant="outline" size="sm" onClick={() => setEditingBootcamp(true)} className="gap-1.5 mt-1">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Admin Panel ────────────────────────────────────────────────
function AdminPanel() {
  const navigate = useNavigate();
  const { resetToDefault } = useSiteData();

  const handleLogout = () => { setAdminLoggedIn(false); navigate('/'); };

  const handleReset = () => {
    if (confirm('Reset all content to defaults? This cannot be undone.')) {
      resetToDefault();
      toast.success('All content reset to defaults');
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <a href="/" target="_blank"><Eye className="h-4 w-4" /> View Site</a>
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-destructive hover:text-destructive">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="events" className="gap-1.5 text-xs sm:text-sm"><Calendar className="h-4 w-4 hidden sm:block" /> Events</TabsTrigger>
            <TabsTrigger value="programs" className="gap-1.5 text-xs sm:text-sm"><BookOpen className="h-4 w-4 hidden sm:block" /> Programs</TabsTrigger>
            <TabsTrigger value="event-sections" className="gap-1.5 text-xs sm:text-sm"><LayoutGrid className="h-4 w-4 hidden sm:block" /> Events Page</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5 text-xs sm:text-sm"><Lock className="h-4 w-4 hidden sm:block" /> Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="events"><UpcomingEventsEditor /></TabsContent>
          <TabsContent value="programs"><ProgramsEditor /></TabsContent>
          <TabsContent value="event-sections"><EventSectionsEditor /></TabsContent>
          <TabsContent value="settings"><ChangeCredentialsSection /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────────────
export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAdminLoggedIn());

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AdminPanel />;
}
